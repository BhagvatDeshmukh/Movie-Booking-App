import * as React from 'react';
import { useEffect, useState, useContext } from 'react';
import { useParams,useNavigate,NavLink, useLocation } from 'react-router-dom';
import axios from "axios";
import context from '../storedContexts';

function LoginFinal() {
  
  let location=useLocation();
  // console.log(location.state[0].redirect)
  let redirect=location.state?location.state[0].redirect:"/";
  let [data,SetData]=useState({});
  let { apiurl, isAuthenticated, setIsAuthenticated } = useContext(context);
  let navigate=useNavigate();
  let [msg,SetMsg]=useState('');

  function handleChange(e){
    let name = e.target.name;
    let value = e.target.value;
    SetData({...data,[name]:value});
  }

  

  function handleSubmit(e){
    e.preventDefault();
    try {
      axios.post(`${apiurl}/login`,data).then((response) => {
        let token;
        console.log(redirect);
        if(response.data.token){
          token=response.data.token;
          localStorage.setItem("token",token);
          setIsAuthenticated(true);
          navigate(redirect);
          }else {
            SetMsg(response.data.msg);
          }
        }


      );
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex justify-center ">
      <div className="w-full max-w-xs p-4 space-y-4 bg-white border border-gray-300 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-xl font-bold">Welcome!</h2>
          <p className="text-sm text-gray-600">Sign in to continue.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email || ''}
              onChange={handleChange}
              placeholder="johndoe@email.com"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              autoComplete="on"
              required
              type="password"
              id="password"
              name="password"
              value={data.password || ''}
              onChange={handleChange}
              placeholder="password"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          {msg!==''&&
        <div className="text-center">
          <p className="text-xs font-semibold text-red-500">
            {msg}
          </p>
        </div>
        }
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:bg-green-500"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? <NavLink to={"/SignUp"} state={{redirect:redirect}} className={`text-blue-500`}>Sign Up</NavLink>
          </p>
        </div>
      </div>
    </div>
  )
};

function SignUpFinal() {
  let [data,SetData]=useState({});
  let { apiurl, isAuthenticated, setIsAuthenticated } = useContext(context);
  let navigate=useNavigate();
  let location=useLocation();
  let redirect=location.state?location.state[0].redirect:"/";
  let [msg,SetMsg]=useState('');
  function handleChange(e){
    let name = e.target.name;
    let value = e.target.value;
    SetData({...data,[name]:value});
  }

  function handleSubmit(e){
    e.preventDefault();
    // console.log(data);
    try {
        axios.post(`${apiurl}/register`,data).then((response) => {
          let token;
          if(response.data.token){
            token=response.data.token;
            localStorage.setItem("token",token);
            setIsAuthenticated(true);
            navigate(redirect?redirect:"/");
            }else {
              SetMsg(response.data.msg);
            }
          }

  
        );
        
      } catch (error) {
        console.log(error);
      }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xs p-4 space-y-4 sm:space-y-2 bg-white border border-gray-300 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-xl font-bold">Welcome!</h2>
          <p className="text-sm text-gray-600">Sign Up to continue.</p>
        </div>
        <form className="space-y-4 sm:space-y-2" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={data.name || ''}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-3 py-1 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email || ''}
              onChange={handleChange}
              placeholder="johndoe@email.com"
              className="w-full px-3 py-1 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              autoComplete="on"
              type="password"
              id="password"
              name="password"
              value={data.password || ''}
              onChange={handleChange}
              placeholder="password"
              className="w-full px-3 py-1 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          {msg!==''&&
        <div className="text-center">
          <p className="text-xs font-semibold text-red-500">
            {msg}
          </p>
        </div>
        }
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 mt-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:bg-green-500"
            >
              Create an Account
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account? <NavLink to={"/SignIn"} state={{redirect:redirect}} className={`text-blue-500`}>Sign In</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export { LoginFinal, SignUpFinal };