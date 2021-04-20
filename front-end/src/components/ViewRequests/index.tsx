import "./index.css";

import { Button, Card, Grid, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLoadingUpdate } from "src/Context/LoadingProvider";
import { baseUrl } from "src/Utils/apiUtils";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

const ViewRequests: React.FC<any> = (props: any) => {
  const { studUser } = props;
  const [requests, setRequests] = useState([]);
  const setIsLoading = useLoadingUpdate();
  const endPoint = studUser.role === 3 ? "getRSOs" : "getStudents";

  // fetches the rsos/new member requests
  useEffect(() => {
    const getRequests = async () => {
      setIsLoading(true);
      const { universityID } = studUser;
      const { data } = await axios.post(`${baseUrl}/${endPoint}`, {
        universityID: universityID,
        getApproved: false,
      });
      setRequests(data.RSOs);
      setIsLoading(false);
    };
    getRequests();
  }, []);

  return (
    <Grid container direction="column" className="requests-container">
      {requests.map((request: any) => {
        const { name, ID, univeristyID } = request;

        return (
          <Grid item xs={12} className="request-item">
            <Card raised>
              <Grid
                container
                direction="row"
                className="approve-deny-container"
                justify="center"
              >
                {/* event title */}
                <Grid item xs={9} className="event-title-item">
                  <Typography variant="h5">{name}</Typography>
                </Grid>

                {/* approve button */}
                <Grid item xs={1}>
                  <Button
                    onClick={() => console.log("api call that sends approve")}
                  >
                    <CheckIcon />
                  </Button>
                </Grid>

                {/* deny button */}
                <Grid item xs={1}>
                  <Button
                    onClick={() => console.log("api call that sends deny")}
                  >
                    <ClearIcon />
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ViewRequests;
