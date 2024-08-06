import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from "axios";
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import context from '../storedContexts';

export default function FreesoloMovie() {
  let navigate=useNavigate();
  let [movieNames, setMovieNames] = React.useState([]);
  let [moviename, setMovieName] = React.useState('');
  let [inputValue, setInputValue] = React.useState('');
  let{apiurl}=React.useContext(context);
  React.useEffect(() => {
    try {
      axios(`http://${apiurl}:3000/getmovies`).then((response) => {
        setMovieNames(response.data);
      });
    } catch (error) {
      console.log(error);
    }

  }, []);
  function handleSubmit() {
    let m = [];
    m = movieNames.filter((movie) => {
      // console.log(movie.moviename===moviename);
      return (movie.moviename === moviename);
    })
    // let v=(m);
    // let a=v[0];
    // console.log(a.movieid);
    if (m.length>0) {
      navigate("Movie/"+m[0].movieid);
    }
  }
  React.useEffect(() => { handleSubmit(); }, [moviename]);
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <SearchIcon color='disabled' />

      <Autocomplete
        value={!moviename ? null : moviename}
        onChange={(event, newValue) => {
          setMovieName(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        size="small"
        options={movieNames.map((option) => option.moviename)}
        sx={{
          // border: "1px solid blue"
          width: 200,
          "& .MuiOutlinedInput-root": {
            // border: "1px solid yellow",
            borderRadius: "0",
            padding: "0"
          },
          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            border: "none"
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search movies"
            autoFocus
            sx={{ '& ::placeholder': { fontSize: 'small' } }}
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />

    </Stack>
  );
}
