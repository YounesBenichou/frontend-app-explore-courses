import { useState ,useEffect, useContext} from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import { getAuthenticatedHttpClient, getAuthenticatedUser} from '@edx/frontend-platform/auth';
import Iconify from '../../../components/iconify';
import { getConfig } from '@edx/frontend-platform';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import {AppContext} from '@edx/frontend-platform/react';


// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

export default function AccountPopover() {

  var _useContext = useContext(AppContext),
  authenticatedUser = _useContext.authenticatedUser,
  config = _useContext.config;

  const [account, setAccount] = useState(null)
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  // UseStates 

  // functions 
  const getAccount = async () =>{
    try {
      const result = await getAuthenticatedHttpClient().get(URL_GET_Account)
      setAccount(result.data[0])   
    }catch( error ){
      console.log(error)
    }
  }
  const MENU_OPTIONS = [
    {
      label: 'Accueil',
      icon: 'eva:home-fill',
      link: config.LMS_BASE_URL
    },
    // {
    //   label: 'Portail d\'administration',
    //   icon: 'eva:home-fill',
    //   link: config.ADMIN_URL + '/admin/'
    // },
    {
      label: 'Profile',
      icon: 'eva:person-fill',
      link: config.ACCOUNT_PROFILE_URL+'/profile/u/'+getAuthenticatedUser().username,
    },
    {
      label: 'Compte',
      icon: 'eva:person-fill',
      link: config.ACCOUNT_SETTINGS_URL,
    },
    {
      label: 'Mes accomplissement',
      icon: 'eva:person-fill',
      link: config.GAMIFICATION_URL+'/gamification/',
    },
    
  ];

  const URL_GET_Account = config.LMS_BASE_URL + "/api/user/v1/accounts?username="+getAuthenticatedUser().username;


  useEffect(()=>{
    getAccount()
  },[])

  return (
    account && 
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              // borderRadius: '50%',
              position: 'absolute',
              // bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar  sx={{borderRadius:'0'}} src={account.profile_image.image_url_full} alt="photoURL" />
        <Iconify onClick={handleOpen} sx={{ marginLeft: '10px',transform:'rotate(180deg)', transform: 'scale(0.7) rotate(180deg)'}}icon="tabler:triangle-filled" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {account.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack sx={{ p: 1 }}>
          {getAuthenticatedUser().administrator&&
          <MenuItem onClick={()=>{
                window.open(config.ADMIN_URL + '/admin/', '_self');
              }}>
                Portail d'administration
          </MenuItem>
          } 
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={()=>{
              window.open(option.link, '_self');
            }}>
              {option.label}
            </MenuItem>
          ))}
          <Divider sx={{ borderStyle: 'dashed' }} />
          <MenuItem onClick={()=>{
                window.open(config.LOGOUT_URL, '_self');
              }}>
                Se déconnecter
          </MenuItem>
        </Stack>

        
            
      </Popover>
    </>
  );
}