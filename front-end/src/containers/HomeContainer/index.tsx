import "./index.css";

import {
  AppBar,
  Button,
  Grid,
  LinearProgress,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";

import StudMenu from "src/components/StudMenu";
import { menuItems } from "src/Utils/menuUtils";

const HomeContainer: React.FC<any> = ({ children, isLoading }) => {
  // setLoading to true, fetch user, set user
  useEffect(() => {}, []);

  return (
    <Grid container className="home-container">
      <Grid item xs={12} className="top-nav-item">
        <AppBar position="static">
          <Toolbar>
            <Grid
              container
              direction="row"
              justify="flex-start"
              className="links-container"
            >
              {menuItems.map((item) => {
                return (
                  <Grid item xs={1} className="links-item">
                    <Button variant="text" disableFocusRipple>
                      <Typography variant="body1" className="link">
                        {item.title}
                      </Typography>
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
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
