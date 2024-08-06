import React from 'react'
import ReactDOM from 'react-dom/client'
import "./index.css";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './pages/Layout.jsx';
import Home from './pages/Home.jsx';
import {LoginFinal,SignUpFinal} from './pages/SignIn.jsx';
import Error from './pages/Error.jsx';
import MoviePage from './pages/MoviePage.jsx';
import Showlist from './pages/Showlist.jsx';
import Seatlayout from './pages/Seatlayout.jsx';
import ConfirmBooking from './pages/ConfirmBooking.jsx';
import Profile from './pages/Profile.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children:[
      {
        index:true,
        element: <Home /> ,
      },
      {
        path:"SignIn",
        element:<LoginFinal />,
      },
      {
        path:"SignUp",
        element:<SignUpFinal />,
      },
      {
        path:"Movie/:id",
        element:<MoviePage />,
      },
      {
        path:"Show/:mid",
        element:<Showlist />,
      },
      {
        path:"seatLayout/:mname/:tname/:showid/:sdate/:stime",
        element:<Seatlayout />,
      },
      {
        path:"confirmBooking/:mname/:tname/:showid/:sdate/:stime/:cost/:seats",
        element:<ConfirmBooking />,
      },
      {
        path:"profile",
        element:<Profile />,
      }
    ]
  },
 
  {
    path:"*",
    element:<Error />
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  
      <RouterProvider router={router} />
  
)
