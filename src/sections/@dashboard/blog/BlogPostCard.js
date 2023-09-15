import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Card, Grid, Avatar, Typography, CardContent } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';
import { AppWidgetSummary } from '../app';
import { getConfig } from '@edx/frontend-platform';
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

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function BlogPostCard({ post, index }) {
  
  const {id, title, summary, created,is_published,cover_photo } = post;
  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;

  const toPostDetail = (id)=>{
    
  }

  return (
    <Grid item xs={12} sm={8} md={4}>
        <Card sx={{ position: 'relative' }}>
        {/* <StyledCardMedia
          sx={{
            pt: 'calc(100% * 4 / 3)',
              '&:after': {
                top: 0,
                content: "''",
                width: '100%',
                height: '100%',
                position: 'absolute',
                bgcolor: 'white',
              },
          }}
        > */}
          {cover_photo && 
            <img alt={title} style={{
              minWidth:'100%',
              minHeight:'200px',
              maxHeight: '200px'
            }} src={getConfig().LMS_BASE_URL +""+ cover_photo} />
          }
        {/* </StyledCardMedia> */}

        <CardContent
          sx={{
            pt: 1,
            bottom: 0,
            width: '100%',
          }}
        >
          <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
            {fDate(created)}
          </Typography>

          <StyledTitle
            color="inherit"
            variant="subtitle2"
            underline="hover"
            sx={{
              color: 'black',
            }}
          >
            {title}
          </StyledTitle>

          <StyledTitle
            color="inherit"
            // variant="subtitle2"
            underline="none"
            variant="subtitle2"
            sx={{
              color: (theme) => alpha(theme.palette.grey[600], 0.72),
            }}
          >
            {summary}
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
                onClick={()=> toPostDetail(id) }
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
  );
}
