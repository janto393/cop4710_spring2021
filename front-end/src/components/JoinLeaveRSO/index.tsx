import { Button, Card, Grid, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "src/Utils/apiUtils";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { useLoadingUpdate } from "src/Context/LoadingProvider";
import { JoinRsoRequest, LeaveRsoRequest } from "src/types/apiRequestBodies";
import { DefaultApiResponse } from "src/types/apiResponseBodies";
import buildpath from "src/Utils/buildpath";

const JoinLeaveRSO: React.FC<any> = (props: any) => {
  const { studUser } = props;
  const { universityID } = studUser;
  const setIsLoading = useLoadingUpdate();

  const rsos = studUser?.RSOs;
  const [userRSOs, setuserRSOs] = useState(rsos ? rsos : []);

  const [universityRSOs, setUniversityRSOs] = useState([]);

  useEffect(() => {
    const getRSOs = async () => {
      setIsLoading(true);
      const { data } = await axios.post(`${baseUrl}/getRSOs`, {
        universityID: universityID,
        getApproved: false,
      });
      // const notIncludingMine = data.RSOs.filter(rso => userRSOs.include())
      console.log(data.RSOs, userRSOs);
      setUniversityRSOs(data.RSOs);
      setIsLoading(false);
    };
    getRSOs();
  }, []);

  const joinRSO = async (rsoID: number): Promise<void> => {
    setIsLoading(true);

    let payload: JoinRsoRequest = {
      userID: studUser.userID,
      universityID: studUser.universityID,
      rsoID: rsoID,
    };

    let request: Object = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    };

    let response: DefaultApiResponse = await (
      await fetch(buildpath("/api/joinRSO"), request)
    ).json();

    if (!response.success) {
      console.error(response.error);
    }

    setIsLoading(false);
  };

  const leaveRSO = async (rsoID: number): Promise<void> => {
    setIsLoading(true);

    let payload: LeaveRsoRequest = {
      userID: studUser.userID,
      rsoID: rsoID,
    };

    let request: Object = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    };

    let response: DefaultApiResponse = await (
      await fetch(buildpath("/api/leaveRSO"), request)
    ).json();

    if (!response.success) {
      console.error(response.error);
    }

    setIsLoading(false);
  };

  return (
    <Grid container direction="column" className="requests-container">
      {userRSOs.map((userRso: any) => {
        const { name, ID } = userRso;

        return (
          <>
            <h2>My RSOs</h2>
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

                  {/* leave button */}
                  <Grid item xs={1}>
                    <Button
                      onClick={() => {
                        leaveRSO(ID);
                      }}
                    >
                      <ClearIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </>
        );
      })}

      {universityRSOs.map((rso: any) => {
        const { name, ID, univeristyID } = rso;

        return (
          <>
            <h2>College RSOs</h2>
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
                      onClick={() => {
                        joinRSO(ID);
                      }}
                    >
                      <CheckIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </>
        );
      })}
    </Grid>
  );
};

export default JoinLeaveRSO;
