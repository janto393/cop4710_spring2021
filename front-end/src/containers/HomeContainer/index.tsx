import "./index.css";

import { AppBar, Grid, LinearProgress, Toolbar } from "@material-ui/core";
import React, { useEffect } from "react";

import StudMenu from "../../components/StudMenu";

const HomeContainer: React.FC<any> = ({ children, isLoading }) => {
  // setLoading to true, fetch user, set user
  useEffect(() => {}, []);

  return (
    <Grid container className="home-container">
      <Grid item xs={12} className="top-nav-item">
        <AppBar position="static">
          <Toolbar>
            <StudMenu />
          </Toolbar>
          {isLoading && <LinearProgress />}
        </AppBar>
      </Grid>

      {/* events will render inside this container */}
      <Grid container className="content-container" justify="center">
        {children}
      </Grid>
    </Grid>
  );
};

export default HomeContainer;
