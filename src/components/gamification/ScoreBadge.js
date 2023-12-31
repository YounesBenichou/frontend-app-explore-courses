import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

// front-app-session 
import { useCookies } from 'react-cookie';
import {AppContext} from '@edx/frontend-platform/react';
import { useContext } from 'react';


const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
...theme.typography.body2,
padding: theme.spacing(1),
textAlign: 'center',
color: theme.palette.text.primary,
}));
const badges = [{
  master : '/assets/badges/master.png'
}]

export default function ScoreBadge() {
    // Authenticated user 
  let userId = '';
  const { authenticatedUser } = useContext(AppContext);
  const user_data = useContext(AppContext);

  if (authenticatedUser) {
    userId = user_data.authenticatedUser.userId;
    console.log(user_data)
  }

  // 
  
  return (
    <>
    <Box sx={{ flexGrow: 1 ,
      }} >
      <Grid container spacing={2} sx={{ 
            paddingInline: '40px', 
            paddingY: '20px',
            display: 'flex', 
            justifyContent: "space-between",
            borderRadius: '20px',
            opacity: '0.9',
            // background: 'red',
            boxShadow: '0px 0px 16px 0px rgba(0, 0, 0, 0.15), 0px 0px 10px 0px rgba(0, 0, 0, 0.15)',
            background: `url(/assets/images/triangle-background.svg)`,
            
        }} >
        <Grid sx={{background:'#fff', display:'flex', background: 'transparent',borderRadius: '20px', justifyContent:'start', alignItems:'center'}} item xs={4}>
          <Item sx={{textAlign: 'start',background: 'transparent',}}>
            <Typography variant="h3">
                Bonjour ! <br></br>Younes Benichou
            </Typography>
          </Item> 
        </Grid>
        <Grid sx={{background:'#fff',background: 'transparent', display:'flex',borderRadius: '20px', justifyContent:'center', alignItems:'center'}} item xs={3}>     
            <Box
                width={140}
                height={140}
                borderRadius="50%" // Set borderRadius to 50% to create a circle
                // bgcolor="primary.main" // Change to the desired background color
                display="flex"
                justifyContent="center"
                alignItems="center"
                color="#D00000"
                border= "10px solid #D00000"
                >
                  <Typography variant="h5" textAlign="center" gutterBottom>
                      200 <br/> pts
                  </Typography>
            </Box>     
        </Grid>
        <Grid sx={{background:'#fff', background: 'transparent', borderRadius: '20px',paddingRight:'40px', display:'flex', justifyContent:'end', alignItems:'center'}} item xs={4}>
          
          <Item sx={{textAlign: 'start', background: 'transparent',}}>
          <Stack direction="column">
            <img width="170" src={'http://local.overhang.io:8000/media/badge_images/Master.png'}/>
            <Typography variant="h6" textAlign="center" gutterBottom>
                Gold
            </Typography>
          </Stack>
             
          </Item> 
        </Grid>
      </Grid>
    </Box>
    </>
    
  );
} 