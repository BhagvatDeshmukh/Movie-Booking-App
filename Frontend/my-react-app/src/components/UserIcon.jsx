import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import context from '../storedContexts';
import { Suspense } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 24, height: 24 ,
      fontSize:'default'
    },
    children: `${name.split(" ")[0].slice(0,1)}`,
  };
}

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}




export default function AccountMenu() {
  
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    let {user,apiurl,setIsAuthenticated}=React.useContext(context);
    let name=user.name;
    let navigate=useNavigate();
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    function handleLogout () {
      try {
        axios.post(`${apiurl}/logout`,{token:localStorage.getItem('token')}).then((response) => {
          {
            let token=response.data.token;
            // console.log(token)
            localStorage.setItem("token",token);
            setIsAuthenticated(false);
            navigate("/");
          }
      });
        
      } catch (error) {
        console.log(error);
      }
      
      setAnchorEl(null);
    };

    function OpenProfile(){
      navigate(`/profile`);
    }

    return (
      <React.Fragment>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Tooltip title="Account">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar  {...stringAvatar(name)} />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              padding:1,
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 20,
                height: 20,
                
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={OpenProfile} sx={{fontSize:'default'}}> 
            Hello 👋 {name}
          </MenuItem>

          <MenuItem onClick={OpenProfile} sx={{fontSize:'default'}}>
          <ListItemIcon>
            <Avatar sx={{fontSize:'default'}} />
            </ListItemIcon>
            Profile
          </MenuItem>
          
          <Divider />
          <MenuItem onClick={handleLogout} sx={{fontSize:'default',bgcolor: 'red', color: 'white'}}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }