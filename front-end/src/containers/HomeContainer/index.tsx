import "./index.css";

import { AppBar, Grid, Toolbar } from "@material-ui/core";
import React, { useState } from "react";

import StudMenu from "../../components/StudMenu";

const HomeContainer: React.FC<any> = () => {
  return (
    <Grid container className="home-container-container">
      <Grid item xs={12} className="top-nav-item">
        <AppBar position="static">
          <Toolbar>
            <StudMenu />
          </Toolbar>
        </AppBar>
      </Grid>

      <Grid container className="content-container">
        {/* events will render inside this container */}
      </Grid>
    </Grid>
  );
};

export default HomeContainer;
