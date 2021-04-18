import "./index.css";

import {
  AppBar,
  Button,
  Grid,
  LinearProgress,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React, { useMemo } from "react";

import Snackbar from "@material-ui/core/Snackbar";
import StudMenu from "../../components/StudMenu";
import { useHistory } from "react-router";
import { useLoading } from "src/Context/LoadingProvider";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

type MenuItem = {
  title: string;
  onClick: Function;
  visibility: Array<number>;
};

const filterLinks = (userVisibility: number, menuItems: Array<MenuItem>) => {
  return menuItems.filter((item) =>
    item.visibility.some((value) => value === userVisibility)
  );
};

const HomeContainer: React.FC<any> = ({
  children,
  canDisplayToast,
  isValid,
  setCanDisplayToast,
  studUser,
}) => {
  const isLoading = useLoading();
  const history = useHistory();

  const menuItems = [
    {
      title: "Home",
      onClick: () => history.push("/home"),
      visibility: [1, 2, 3],
    },
    {
      title: "Create Event",
      onClick: () => history.push("/createEvent"),
      visibility: [2],
    },
    {
      title: "Register RSO",
      onClick: () => history.push("/registerRso"),
      visibility: [1, 2],
    },
    {
      title: "View Requests",
      onClick: () => history.push("/viewRequests"),
      visibility: [2, 3],
    },
  ];

  const visibleMenu = useMemo(() => filterLinks(studUser?.role, menuItems), []);

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
              {visibleMenu.map((item) => {
                return (
                  <Grid item xs={1} className="links-item">
                    <Button
                      variant="text"
                      disableFocusRipple={true}
                      onClick={() => item.onClick()}
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
        </AppBar>
        {isLoading && <LinearProgress />}
      </Grid>

      {/* events will render inside this container */}
      <Grid container className="content-container" justify="center">
        {children}
      </Grid>
      {canDisplayToast && (
        <Snackbar
          open={true}
          autoHideDuration={5000}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          onClose={() => setCanDisplayToast(false)}
        >
          <Alert
            onClose={() => setCanDisplayToast(false)}
            severity={!isValid ? "error" : "success"}
          >
            {!isValid
              ? "Error submitting request."
              : "Request succussfully submitted!"}
          </Alert>
        </Snackbar>
      )}
    </Grid>
  );
};

export default HomeContainer;
