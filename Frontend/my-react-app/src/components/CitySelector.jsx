import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import context  from '../storedContexts';
import axios from "axios";

export default function ControllableStates({setShowLocation}) {
  let {city,setCity,apiurl}=React.useContext(context);
  let [inputValue, setInputValue] = React.useState('');
  let [options,setOptions] =React.useState([]);

  React.useEffect(()=>{
    try {
      axios(`${apiurl}/getcities`).then((response)=>{
        console.log(response.data);
        let arr=[];
        response.data.forEach(city=>{arr.push(city.cityname)});
      setOptions(arr);
      });
    } catch (error) {
      console.log(error);
    }
      
    },[])

  return (
    <div className='w-screen h-full bg-gray-700/50 fixed z-30'>
      <div className='relative top-1/3 left-1/3 bg-white w-1/3 px-2 py-3 '>
      <div className='px-3 py-1'>Select the City</div>
      <Autocomplete
        value={city==''?null:city}
        onChange={(event, newValue) => {
          setCity(newValue);
          localStorage.setItem('city',newValue);
          setShowLocation(false);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="controllable-states-demo"
        options={options}
        size='small'
        renderInput={(params) => <TextField {...params} label="City" autoFocus />}
      />
      </div>
    </div>
  );
}
