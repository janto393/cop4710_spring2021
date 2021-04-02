import axios from "axios";
import { useState } from "react";

export type UserInfoType = {
  userName: "";
  firstName: any;
  lastName: any;
  email: any;
  role?: any;
  universityID: any;
  rsoID: any;
  password: any;
  rePassword?: any;
};

const INITIAL_VALUE: UserInfoType = {
  userName: "",
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  universityID: "",
  rsoID: "",
  password: "",
  rePassword: "",
};

export const useRegister = () => {
  const [registerInfo, setRegisterInfo] = useState(INITIAL_VALUE);
  const [isLoading, setIsLoading] = useState(false);

  const registerUser = async () => {
    setIsLoading(true);
    const {
      userName,
      firstName,
      lastName,
      email,
      role,
      universityID,
      rsoID,
    } = registerInfo;

    // call to regiser account
    await axios
      .post("http://localhost:5000/api/register", {
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role,
        universityID: universityID,
        rsoID: rsoID,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log("Error registering account", e);
      });

    setIsLoading(false);
  };

  return {
    registerInfo,
    setRegisterInfo,
    registerUser,
    isLoading,
  };
};
