
// components
import { Switch, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";


import ThemeProvider from "./theme";
import ScrollToTop from "./components/scroll-to-top/ScrollToTop";
import StyledChart from "./components/chart";
// layouts
import DashboardLayout from './layouts/dashboard';


function App() {

  return (
    <BrowserRouter>
      <ThemeProvider>
        <ScrollToTop />
        <Switch>
          <Route path="/"><DashboardLayout /></Route>
        </Switch>  
      </ThemeProvider>
    </BrowserRouter>      
  );
}

export default App;

