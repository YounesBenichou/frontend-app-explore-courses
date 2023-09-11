import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Button } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// components
//
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import ButtonGroup from '@mui/material/ButtonGroup';
import palette from '../../../theme/palette';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: '100%',
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));
// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

const HeaderNavigationButton = styled(Button)(({theme})=>({
  border: '0px',
  color: '#000',
  borderRadius: '0px',
  textTransform: 'none',
  '&:hover': {
    background: palette.red['darker'],
    color: '#fff',
    border: '0px',
 },
}))


export default function Header({ onOpenNav }) {
  return (
    <StyledRoot>
      <StyledToolbar sx={{
        display:'flex',
        justifyContent: 'space-between',
      }}>
        <Stack
            direction="row"
            alignItems="center"
            spacing={{
              xs: 0.5,
              sm: 1,
            }}
          >
        <img width={120} src={'/assets/djezzy_academy.jpg'}></img>
        
        
        </Stack>
        {/* <Searchbar /> */}
        {/* <Box sx={{ flexGrow: 1 }} /> */}
        
          <Stack
            direction="row"
            alignItems="center"
            spacing={{
              xs: 0.5,
              sm: 1,
            }}
          >
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
