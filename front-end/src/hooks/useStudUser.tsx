import { useState } from "react";

export type UserInfoType = {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  universityID: number;
  rsoID: number;
  role?: number;
  profilePicture?: any;
};

const INITIAL_VALUE: UserInfoType = {
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  email: "",
  universityID: 1,
  rsoID: 1,
  role: 1,
};

export const useStudUser = () => {
  const [studUser, setStudUser] = useState(INITIAL_VALUE);

  return {
    studUser,
    setStudUser,
  };
};
