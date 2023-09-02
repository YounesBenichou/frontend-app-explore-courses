import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
//
import { Switch, Route } from "react-router-dom";
import Header from './header';
import Nav from './nav';
import UserPage from '../../pages/UserPage';
import BlogPage from '../../pages/BlogPage';
import GamificationPage from '../../pages/GamificationPage';
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  return (
    <StyledRoot>

      <Header onOpenNav={() => setOpen(true)} />

      <Nav openNav={open} onCloseNav={() => setOpen(false)} />

      <Main>
      <Switch>
            <Route path="/dashboard/user"><UserPage /></Route>
            <Route path="/dashboard/blog"><BlogPage /></Route>
            <Route path="/dashboard/product"><GamificationPage /></Route>
      </Switch>
      </Main>
    </StyledRoot>
  );
}
