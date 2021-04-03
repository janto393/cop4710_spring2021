import axios from "axios";
import { useState } from "react";

export type UserInfoType = {
  username: any;
  firstname: any;
  lastname: any;
  email: any;
  role?: any;
  profilePicture?: any;
  universityID: any;
  rsoID: any;
  password: any;
  rePassword?: any;
};

const INITIAL_VALUE: UserInfoType = {
  username: "",
  firstname: "",
  lastname: "",
  email: "",
  role: "",
  universityID: "",
  rsoID: "",
  password: "",
  rePassword: "",
};

export const useStudUser = () => {
  const [studUser, setStudUser] = useState(INITIAL_VALUE);
  const [isLoading, setIsLoading] = useState(false);

  const logIn = async (username: string, password: string) => {
    setIsLoading(true);

    await axios
      .post("http://localhost:5000/api/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        const { data } = res;

        setStudUser(data.userData);

        data.success === false
          ? alert("Username and/or password incorrect.")
          : alert("Successfully logged in!");
      })
      .catch((e) => {
        console.log(e);
      });

    setIsLoading(false);
  };

  const submitUserRegistration = async () => {
    setIsLoading(true);

    const {
      username,
      password,
      firstname,
      lastname,
      email,
      universityID, // hard coded for test
      rsoID, // ^
      role,
    } = studUser;

    const registerBody = {
      username: username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      universityID: 1,
      rsoID: 1,
      role: role,
      password: password,
    };

    // call to regiser account
    await axios
      .post("http://localhost:5000/api/register", registerBody)
      .then((res) => {
        const { data } = res;
        data.success === false
          ? alert("Account successfully created!")
          : alert("Error creating account!");
      })
      .catch((e) => {
        console.log("Unknown error registering account", e);
      });

    setIsLoading(false);
  };

  return {
    studUser,
    setStudUser,
    submitUserRegistration,
    isLoading,
    logIn,
  };
};
