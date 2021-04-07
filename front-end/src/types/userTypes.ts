export interface UserDataWithoutPassword {
  ID: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  universityID: number;
  rsoID: number;
  role: number;
  profilePicture: Buffer | undefined;
}

export interface UserDataWithPassword extends UserDataWithoutPassword {
  password: string;
}
