import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import env from "dotenv";
import cors from "cors";
import axios from "axios";
import jwt from "jsonwebtoken";

const app = express();
const port = process.env.BASE_PORT || 3000;
const saltRounds = 10;
env.config();

const corsWhitelist = ['http://localhost:5173', 'http://172.17.0.217:5173'];
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    const isOriginWhitelist = (origin && corsWhitelist.includes(origin));
    callback(null, isOriginWhitelist);
  }
}))



const db = new pg.Client({
  url: process.env.DEPLOYED_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  migrations: [],
  subscribers: [],
});
db.connect();

app.get("/getmovies", async (req, res) => {
  try {
    let moviesdb = await db.query("SELECT movieid,moviename,posteraddr FROM movies;");
    let movies = moviesdb.rows;
    res.json(movies);
  } catch (error) {
    console.log(error);
  }

});

app.get("/getmovieDetails/:id", async (req, res) => {
  let id = (req.params.id);
  try {
    let moviesdb = await db.query(`SELECT * FROM movies WHERE movieid='${id}';`);
    let movies = moviesdb.rows;
    res.json(movies);
  } catch (error) {
    console.log(error);
  }

});

app.get("/getmoviesbycity", async (req, res) => {
  let city = req.query.city;
  try {
    let moviesdb = await db.query(`SELECT movieid,moviename,posteraddr FROM movies JOIN (SELECT DISTINCT mid FROM events WHERE cid=(SELECT cityid from cities WHERE cityname='${city}')) AS movid ON movid.mid=movies.movieid;`);
    let movies = moviesdb.rows;
    res.json(movies);
  } catch (error) {
    console.log(error);
  }

});

app.get("/getcities", async (req, res) => {
  try {
    let response = await db.query(`SELECT cityname from cities ORDER BY cityid ASC;`);
    let cities = response.rows;
    res.json(cities);
  } catch (error) {
    console.log(error);
  }

});

app.get("/showlist", async (req, res) => {
  let city = req.query.city;
  let mid = req.query.mid;
  let sdate = req.query.sdate;
  let stime = req.query.stime;
  // console.log(sdate)
  if (!stime) { let d = new Date(); stime = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(); }
  // console.log(stime)
  try {
    let response = await db.query(`SELECT eid,theatername,showid,sdate,stime,price 
FROM 
((SELECT eventid,theatername 
FROM
(SELECT * FROM events WHERE cid=(SELECT cityid from cities WHERE cityname='${city}') AND mid=${mid}) e
JOIN
theaters 
ON
e.tid=theaters.theaterid 
) a
JOIN
(SELECT * FROM shows WHERE sdate='${sdate}' ${sdate == '2024-07-11T00:00:00.000Z' ? ` AND stime>'${stime}'` : ``}) s
ON s.eid=a.eventid) b
JOIN
pricingtable
ON b.showid=pricingtable.show_id
ORDER BY eid ASC;`);
    let shows = response.rows;
    // console.log(shows);
    const groupByTheater = (shows) => {
      let temp = shows.reduce((acc, show) => {
        if (!acc[show.theatername]) {
          acc[show.theatername] = [];
        }
        acc[show.theatername].push(show);
        return acc;
      }, {});
      return Object.keys(temp).map(key => { let obj = { [key]: temp[key] }; return obj; });
    };
    let showsfortheaters = groupByTheater(shows);
    // console.log(showsfortheaters)
    res.json(showsfortheaters);
  } catch (error) {
    console.log(error);
  }

});

app.get("/getSeatlayout/:showid", async (req, res) => {
  let showid = (req.params.showid);
  try {
    let data = await db.query(`SELECT * FROM seatinfo WHERE show_s_id=${showid}`);
    let seatlayout = data.rows;
    res.json(seatlayout);
  } catch (error) {
    console.log(error);
  }

});

app.get("/getshowpricing/:showid", async (req, res) => {
  let showid = (req.params.showid);
  try {
    let data = await db.query(`SELECT price FROM pricingtable WHERE show_id=${showid}`);
    let pricing = data.rows;
    res.json(pricing);
  } catch (error) {
    console.log(error);
  }

});

app.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.json({
        msg: 'user already exists try signin', token: false
      });
    } else {
      let hash = await bcrypt.hash(password, 10);
      const result = await db.query(
        "INSERT INTO users (name,email, password) VALUES ($1, $2,$3) RETURNING name,email,userid",
        [name, email, hash]
      );
      // console.log(result.rows[0])
      jwt.sign(result.rows[0], process.env.SESSION_SECRET, { expiresIn: 60 * 60 * 24 }, function (err, token) {
        if (err) {
          res.json({ err }).status(404);
        } else {
          res.json({ token: token });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // console.log("yt")
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      let isMatched = await bcrypt.compare(password, storedPassword);
      if (isMatched) {
        jwt.sign({ name: user.name, email: user.email, userid: user.userid }, process.env.SESSION_SECRET, { expiresIn: 60 * 60 * 24 }, function (err, token) {
          if (err) {
            res.json({ err }).status(404);
          } else {
            res.json({ token: token });
          }
        });
      } else {
        res.json({
          msg: "Incorrect Password", token: false
        });
      }
    } else {
      res.json({
        msg: "User Not Found, Create A/c", token: false
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/verify", async (req, res) => {
  let token = req.body.token;
  // console.log(token);
  try {
    jwt.verify(token, process.env.SESSION_SECRET, function (err, user) {
      if (err) {
        res.json({
          user: null
        });
      } else if (user) {
        // console.log(user);
        res.json({ user: user });
      }
    });
  } catch (error) {
    console.log(error)
  }

})

app.post("/logout", async (req, res) => {
  let token = req.body.token;
  // console.log(token);
  try {
    jwt.verify(token, process.env.SESSION_SECRET, (err, user) => {
      if (err) { console.log(err) } else {
        let delete_user = { ...user, exp: user.iat }
        jwt.sign(delete_user, process.env.SESSION_SECRET, (err, token) => {
          if (err) {
            res.json({ err }).status(404);
          } else {
            // console.log(token)
            res.json({ token: token });
          }
        });
      }
    });
  } catch (error) {
    console.log(error)
  }
});

app.post("/insertintopb", async (req, res) => {
  // let token=req.body.token;
  // console.log(token);
  let upbid = req.body.userid;
  let spbid = req.body.showid;
  let seats = req.body.seats;
  let temp = true;
  // console.log(seats[0]);
  let query = '';
  for (let i = 0; i < seats.length; i++) {
    if (i == seats.length - 1) { query += `('${upbid}', '${spbid}', '${seats[i]}') `; }
    else {
      query += `('${upbid}', '${spbid}', '${seats[i]}'), `;
    }
  }
  let squery = '';
  for (let i = 0; i < seats.length; i++) {
    if (i == seats.length - 1) { squery += `'${seats[i]}' `; }
    else {
      squery += `'${seats[i]}', `;
    }
  }

  try {
    // console.log(squery);
    let pbintable = await db.query(`SELECT * FROM public.prebookings WHERE spbid=${spbid} AND seatpbno IN (${squery});`);

    let apb = [];
      apb = pbintable.rows.filter((pb) => { return seats.includes(pb.seatpbno) && pb.maxtime < new Date() });
      let pbsarr = [];
      for (let i = 0; i < pbintable.rows.length; i++) {
        pbsarr.push(pbintable.rows[i].seatpbno);
      }
      let npb = [];
      // console.log(pbintable.rows.length);
      npb = seats.filter((s) => { return !pbsarr.includes(s) });
      // console.log("apb",apb)
      // console.log("npb",npb)
      let npbquery = '';
      for (let i = 0; i < npb.length; i++) {
        if (i == npb.length - 1) { npbquery += `('${upbid}', '${spbid}', '${npb[i]}') `; }
        else {
          npbquery += `('${upbid}', '${spbid}', '${npb[i]}'), `;
        }
      }

      let apbquery = '';

      for (let i = 0; i < apb.length; i++) {
        if (i == apb.length - 1) { apbquery += `'${apb[i].seatpbno}' `; }
        else {
          apbquery += `'${apb[i].seatpbno}', `;
        }
      }


    if (pbintable.rows.length == 0) {
      await db.query(`INSERT INTO public.prebookings (upbid, spbid, seatpbno) VALUES ${query};`);
      console.log("pb", pbintable.rows)
    }

    else if ((apb.length + npb.length) < seats.length) {

      if (temp) {
        res.json({ msg: "Oops! Error Occured ,Please Try Again Later", err: true }); console.log("unexp seats");
        temp = false;
      }
    }
    // else if(pbintable.rows.filter((pb) => { return seats.includes(pb.seatpbno) });)
    else {
            if (npb.length > 0) {
        await db.query(`INSERT INTO public.prebookings (upbid, spbid, seatpbno) VALUES ${npbquery};`);
        console.log("npb", npb)
      }
      
      // console.log(npb)
      // console.log(apb)
      // console.log(upbid)
      // console.log(spbid)
      if (apb.length > 0) {
        try {
          await db.query(`UPDATE public.prebookings SET upbid=${upbid}, maxtime=(CURRENT_TIMESTAMP + '00:01:00'::interval) WHERE spbid=${spbid} AND seatpbno IN (${apbquery}) AND maxtime<CURRENT_TIMESTAMP;`);
          console.log("apb", apbquery);
        } catch (error) {

          if (temp) {
            res.json({ msg: "Oops! Error Occured ,Please Try Again Later", err: true }); console.log("apb err");
            temp = false;
          }
        }
      } else (console.log(" apb 0 err"))

      // console.log((apb.length+npb.length)<seats.length)

      
    }
    if (temp) {
      res.json({ msg: "Succesfully Queued", err: false }); console.log("succesful");
      temp = false
    }
  } catch (err) {
    res.json({ msg: "Oops! Error Occured ,Please Try Again Later", err: true })
    // res.status(404);
    console.log(err)
  }
});

app.post("/book", async (req, res) => {
  let seats = req.body.seats;
  let token = req.body.token;
  let showid = req.body.showid;
  // console.log(token);
  try {
    //if user is authorised
    jwt.verify(token, process.env.SESSION_SECRET, async function (err, user) {
      if (err) {
        //if not return error
        res.json({
          err: true,
          msg: 'token expired'
        });
      } else if (user) {
        //if authorised
        let squery = '';
        for (let i = 0; i < seats.length; i++) {
          if (i == seats.length - 1) { squery += `'${seats[i]}' `; }
          else {
            squery += `'${seats[i]}', `;
          }
        }
        //check if active in prebooking table for all seats
        const result = await db.query(`SELECT * FROM public.prebookings WHERE spbid=${showid} AND seatpbno IN (${squery}) AND upbid=${user.userid};`);
        if (result.rows.length < seats.length) {
          //if not return error
          res.json({
            err: true,
            msg: 'not found in PBT'
          });
        }
        else if (result.rows.length == seats.length) {
          //if in pbt and signedin
          //check if seat avaliable or not for all seats
          const ava_count = await db.query(`SELECT count (seat ->> 'avaliablity') AS availabilitycount FROM seatinfo,jsonb_array_elements(layout) AS category,jsonb_array_elements(category -> 'seats') AS seat WHERE seat ->> 'id' IN (${squery}) AND show_s_id=${showid} AND seat ->> 'avaliablity' ='1';`);
          if (seats.length > ava_count.rows[0].availabilitycount) {
            //if some seats are already booked
            res.json({
              err: true,
              msg: 'already booked'
            });
          }
          else {
            //seats avaliable
            //book it
            
            try {
              db.query(`UPDATE seatinfo
SET layout = (
  SELECT jsonb_agg(
    jsonb_set(
      category,
      '{seats}',
      (
        SELECT jsonb_agg(
          CASE
            WHEN seat ->> 'id' IN (${squery}) THEN
              jsonb_set(seat, '{avaliablity}', '0'::jsonb)
            ELSE seat
          END
        )
        FROM jsonb_array_elements(category -> 'seats') AS seat
      )
    )
  )
  FROM jsonb_array_elements(layout) AS category
)
WHERE 
  show_s_id = ${showid};`).then(()=>{
    //adding bookings in booking table
    let query = '';
  for (let i = 0; i < seats.length; i++) {
    if (i == seats.length - 1) { query += `('${user.userid}', '${showid}', '${seats[i]}') `; }
    else {
      query += `('${user.userid}', '${showid}', '${seats[i]}'), `;
    }
  }
    try{db.query(`INSERT INTO public.bookings (uid, sbid, seatno) VALUES ${query};`).then(()=>{
      res.json({
        err: false,
        msg: "booking confirmed"
      });
    })} catch(error){
      console.log(error);
      res.json({
        err: true,
        msg: "db error can not book"
      });
    };
  })
            } catch (error) {
              res.json({
                err: true,
                msg: "db error can not book"
              });
            }

          }
        }
      }
    });
  } catch (error) {
    console.log(error)
  }
});

app.get("/getBookings", async (req, res) => {
  
  let userid = req.query.userid;
  // console.log(req.query.userid)
  try {
    let data = await db.query(`SELECT * from bookings WHERE uid=${userid};`);
    let allbookingsbyruser = data.rows;
    const groupByShows = (bookings) => {
      let temp = bookings.reduce((acc, booking) => {
        if (!acc[booking.sbid]) {
          acc[booking.sbid] = [];
        }
        acc[booking.sbid].push(booking.seatno);
        return acc;
      }, {});
      return Object.keys(temp).map(key => { let obj = { [key]: temp[key] }; return obj; });
    };
    let bookingsbyshow=groupByShows(allbookingsbyruser);
    res.json(bookingsbyshow);
  } catch (error) {
    // console.log("e")
    console.log(error);
  }

});

app.get("/getShowDetails/:showid", async (req, res) => {
  let showid = parseInt(req.params.showid);
  // console.log(showid);
  try {
    let data = await db.query(`SELECT sdate,stime,moviename,cityname,theatername,posteraddr,price FROM (SELECT showid,sdate,stime,mid,cid,tid FROM (SELECT * FROM shows WHERE showid=${showid}) s
JOIN
events ON events.eventid=s.eid) d
JOIN
theaters ON theaters.theaterid=d.tid
JOIN
cities ON cities.cityid=d.cid
JOIN
movies ON movies.movieid=d.mid
JOIN
pricingtable ON pricingtable.show_id=d.showid
;`);
    let showDetails = data.rows;
    res.json(showDetails);
  } catch (error) {
    console.log(error);
  }

});

app.listen(port, () => { console.log(`listening at port ${port}`) });

