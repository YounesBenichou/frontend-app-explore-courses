import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useHistory, useParams} from 'react-router-dom';
// @mui
import {
  Container,
  Typography,

} from '@mui/material';

// mock
import palette from '../theme/palette';
import axios from 'axios';
import { getConfig } from '@edx/frontend-platform';

// ----------------------------------------------------------------------
// front-app-session 
import {AppContext} from '@edx/frontend-platform/react';
import { useContext } from 'react';
//

function ContentPreview({ content }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
}


export default function BlogPageDetail() {
  const { postId } = useParams();
  // authn
  let userId = '';
  const { authenticatedUser } = useContext(AppContext);
  const user_data = useContext(AppContext);

  if (authenticatedUser) {
    userId = user_data.authenticatedUser.userId;
  }

  // Consts

  const URL_GET_Post = getConfig().LMS_BASE_URL + "/api/posts/v1/posts/"+postId+"/"+userId+'/'

  // UseStates 
  const [post, setPost] = useState()

  // functions 
  const getPost = async () =>{
    try {
      const result = await axios.get(URL_GET_Post)
      setPost(result.data)
    }catch( error ){
      console.log(error)
    }
  }

  

  // 
  useEffect(() => {
    getPost()
  }, []);

  return (
    post && 
    <>
      <Helmet>
        <title> Course | Minimal UI </title>
      </Helmet>

      <Container sx={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        flexDirection: 'column'
      }}>
        
        {post.cover_photo && <img style={{maxWidth:'100%', height:'auto',}} alt={post.title} src={getConfig().LMS_BASE_URL +""+ post.cover_photo} />}
        <Typography my={3} sx={{textAlign:'center'}} variant="h2" component="div">
          {post.title}
        </Typography>

        <Typography my={3} sx={{textAlign:'center', 'color': palette.grey['700']}} variant="h4" component="div">
          {post.summary}
        </Typography>
        <ContentPreview content={post.content} />
      </Container>


    </>
  );
}
