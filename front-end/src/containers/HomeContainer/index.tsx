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

import StudMenu from "../../components/StudMenu";
import { useHistory } from "react-router";

const HomeContainer: React.FC<any> = ({ children, isLoading }) => {
  const history = useHistory();

  const menuItems = [
    { title: "Home", onClick: () => history.push("/home") },
    { title: "Create Event", onClick: () => history.push("/createEvent") },
    { title: "Register RSO", onClick: () => history.push("/registerRso") },
    { title: "View Requests", onClick: () => history.push("/viewRequests") },
  ];

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
                    <Button
                      variant="text"
                      disableFocusRipple
                      onClick={item.onClick}
                    >
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
