import React from 'react';
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import Seatgrid from '../components/Seatgrid';
import context from '../storedContexts';
import Snackbar from '@mui/material/Snackbar';
import { Slide } from '@mui/material';
import Alert from '@mui/material/Alert';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function Seatlayout() {
    let { showid, mname,tname,sdate,stime } = useParams();
    let [data, setData] = useState({});
    let [pricing, setPricing] = useState({});
    let [selectedSeats, setSelectedSeats] = useState([]);
    let [cost, setCost] = useState(0);
    let { apiurl } = useContext(context);
    let [showSnakbar, SetShowSnakbar] = useState(false);

    let navigate = useNavigate();
    useEffect(() => {
        try {

            axios(`${apiurl}/getSeatlayout/${showid}`).then((response) => {

                setData(response.data[0]);

            }).then(() =>
                axios(`${apiurl}/getshowpricing/${showid}`).then((response) => {

                    setPricing(response.data[0].price);
                    // console.log(response.data);

                }));
        } catch (error) {
            console.log(error);
        }

    }, []);

    function handleClick(seatid, price, action) {
        if (action && selectedSeats.length < 5) {
            setSelectedSeats([...selectedSeats, seatid]);
            setCost((cost) => cost + price);

        }
        else if (action == false) {

            let arr = selectedSeats.slice();
            let index = arr.indexOf(seatid);
            arr.splice(index, 1);
            setSelectedSeats(arr);
            setCost(() => cost - price);
        }
        else if (action && selectedSeats.length >= 5) {
            SetShowSnakbar(true);
            let arr = [];
            arr = selectedSeats.slice();
            let le = arr[arr.length - 1];
            setCost((cost) => cost + price - pricing[le.split("-")[0]]);
            arr.splice(-1, 1);
            setSelectedSeats([...arr, seatid]);
        }
    }
    // console.log(cost);
    return (

        <div className='bg-white px-4 py-2 min-w-full min-h-screen relative flex flex-col justify-between space-y-5'>
            <div >
                <div className='flex justify-start gap-2 mb-10 content-center'>
                    <div className='text-lg font-base border rounded order-2 p-2'>{tname}<br></br><span className='text-sm'>{mname}, </span><span className='text-xs'>{sdate}, {stime}</span></div>
                    <button className='text-xs underline underline-offset-2 mt-2' onClick={() => navigate(-1)}><ArrowBackIosNewIcon fontSize="small"/></button>
                </div>
                <div className='flex flex-col gap-2 mx-auto max-w-fit '>
                    <div className='text-xs ring-2 mb-8 me-0 ms-auto w-40 text-center tracking-widest'>screen</div>
                    {

                        data.layout &&
                        data.layout.map((category, index) => {
                            return <Seatgrid key={index} category={category.cat_name} columns={category.columns} seats={category.seats} price={pricing[category.cat_name]} handleClick={handleClick} selectedSeats={selectedSeats} />
                        })
                    }
                </div>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={showSnakbar}
                    onClose={() => SetShowSnakbar(false)}
                    autoHideDuration={1500}
                    TransitionComponent={Slide}
                    sx={{ py: 1 }}
                >
                    <Alert variant="outlined" severity="warning" color='error' sx={{ bgcolor: 'background.paper', fontSize: 'default', py: 1, my: 1 }}>
                        Max 5 Seats Limit Reached
                    </Alert>
                </Snackbar>
            </div>
            {selectedSeats.length > 0 &&
                <div className='sticky bg-white py-2 border-t-2 gap-2 bottom-0 w-full flex flex-col justify-center content-center items-center'>
                    <button className='bg-red-500 rounded text-white w-full sm:max-w-60 max-w-sm text-lg sm:text-xs px-4 py-2 hover:bg-red-600 '
                    onClick={()=>navigate("/confirmBooking/"+mname+"/"+tname+"/"+showid+"/"+sdate+"/"+stime+"/"+cost+"/"+selectedSeats)}
                    >Pay ${cost}</button>
                </div>
            }
        </div>
    )
}

export default Seatlayout