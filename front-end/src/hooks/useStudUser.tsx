import { useState } from "react";

export type StudUser = {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  universityID: number;
  rsoID: Array<number>;
  role?: number;
  profilePicture?: any;
};

const INITIAL_VALUE: StudUser = {
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  email: "",
  universityID: 1,
  rsoID: [],
  role: 1,
};

export const useStudUser = () => {
  const [studUser, setStudUser] = useState(INITIAL_VALUE);

  return {
    studUser,
    setStudUser,
  };
};
