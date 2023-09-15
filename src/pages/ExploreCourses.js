import { Helmet } from 'react-helmet-async';
import { filter, forEach } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
import { Redirect } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
// @mui

import { alpha, styled } from '@mui/material/styles';
import { Container, TextField, Box, Link, Stack,Card, Grid, Avatar, Typography, CardContent } from '@mui/material';
// utils
import { fDate } from '../utils/formatTime';

// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import Alert from '@mui/material/Alert';

// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import palette from '../theme/palette';
import axios from 'axios';
import { getConfig } from '@edx/frontend-platform';

// ----------------------------------------------------------------------
// front-app-session 
import { useCookies } from 'react-cookie';
import {AppContext} from '@edx/frontend-platform/react';
import { useContext } from 'react';
//


// ----------------------------------------------------------------------


const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const StyledInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  marginTop: theme.spacing(1),
  color: theme.palette.text.disabled,
}));

const StyledCover = styled('img')({
  top: 0,
  width: '100%',
  height: '70%',
  objectFit: 'cover',
  position: 'absolute',
});
// ----------------------------------------------------------------------



export default function ExploreCourses() {
  // authn
  let userId = '';
  const { authenticatedUser } = useContext(AppContext);
  const user_data = useContext(AppContext);

  if (authenticatedUser) {
    userId = user_data.authenticatedUser.userId;
  }

  // routing 
  const history = useHistory();
  // Consts

  const URL_GET_Courses = getConfig().LMS_BASE_URL + "/api/courses/v1/courses/"

  // UseStates 
  const [courses, setCourses] = useState([])
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterCourse,setFilterCourse] = useState("")
  // functions 
  const getCourses = async (page) =>{
    try {
      const result = await axios.get(URL_GET_Courses+"?admin=false&page="+page+"&filterCourse="+filterCourse)
      
      setNumPages(result.data.pagination.num_pages)
      setCourses(result.data.results)
    }catch( error ){
      console.log(error)
    }
  }

  useEffect(()=>{
    getCourses(1)
  },[])

  useEffect(()=>{
    console.log(courses)
  },[courses])


  const toCourseDetail = (course_id)=>{
    window.open(getConfig().LMS_BASE_URL + "/courses/"+course_id+"/about", "_self");   
  }

  
  const handleChange = (event, page) => {
    getCourses(page);
  };
  return (
    courses && 
    <>
      <Helmet>
        <title> Explorer cours </title>
      </Helmet>

      <Container>
      <Stack my={7} sx={{
            display:"flex",
            justifyContent:"start",
            alignItems:"center",
            flexDirection: 'row',
            width:'100%'
          }}>
      <FormControl sx={{width:'50%', marginRight:'20px'}}>
            <TextField
              
              id="nomCourse"
              name="nomCourse"
              label="Rechercher article"
              placeholder='par exemple, Introduction au marketing'
              fullWidth
              autoComplete="given-name"
              defaultValue={filterCourse}
              value={filterCourse}
              sx={{
                borderColor :  'grey',
                borderRadius: '10px',
                
              }}

              onChange={(e) => {
                setFilterCourse(e.target.value.toString())
              }}
            />
      </FormControl>
      <FilterAltIcon onClick={()=> getCourses(1)} sx={{
        transform: 'scale(1.5)',
        '&:hover' : {
          transform: 'scale(2)'
        }
      }}></FilterAltIcon>
      </Stack>
     
        <Grid container spacing={3}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={8} md={4}>
              <Card sx={{ 
                position: 'relative',
                borderRadius: '10px',
                border: '1px solid rgba(0, 0, 0, 0.17)',
                background: '#FFF',
                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
              
              }} 
              
              onClick={()=>toCourseDetail(course.course_id)}>
                 
                
                  <img style={{
                    minWidth:'100%',
                    minHeight:'200px',
                    maxHeight: '200px'
                  }} src={ getConfig().LMS_BASE_URL + course.media.course_image.uri } />
                  
                
              {/* </StyledCardMedia> */}
      
              <CardContent
                sx={{
                  pt: 1,
                  bottom: 0,
                  width: '100%',
                }}
              >
                <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                Date de début : {fDate(course.start)}
                </Typography>
      
                <StyledTitle
                  color="inherit"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    color: 'black',
                  }}
                >
                  {course.name}
                </StyledTitle>
      
                
                {/* <Typography variant="subtitle2">Plus de détails</Typography> */}
                
                <StyledInfo>
                    <Box
                      key={index}
                      mt={2}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'start',
                        alignItems:'center',
                        color: 'black',
                        '&:hover': {
                          // Define the styles you want to apply on hover here
                          cursor: 'pointer', // Change the cursor to a pointer on hover
                          textDecoration: 'underline'
                        },
                      }}
                      onClick={()=> toCourseDetail(course.course_id) }
                    >
                      <Typography 
                      mr={1}
                      sx={{
                        
                        
                      }}
                      variant="subtitle2">Plus de détails
                      
                      </Typography>
                      <img  width={30} src={'/assets/icons/arrow-detail.svg'}></img>
                    </Box>
                </StyledInfo>
              </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Stack mt={4} sx={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            flexDirection: 'column'
          }}
          spacing={2}>
          <Pagination sx={{
            '&.MuiPagination-root': {
              button : {
                color: 'white',
                background: palette.red['darker'],
                '&:hover' : {
                  color: 'white',
                  background: palette.red['darker'], 
                }
             }
            }
          }} count={numPages} onChange={handleChange} on showFirstButton showLastButton />
        </Stack>
      </Container>


    </>
  );
}
