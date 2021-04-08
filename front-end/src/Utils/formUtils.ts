export const getEventImages = (files: File[], pictures: string[]): string[] => {
  return pictures.map((picture) => {
    return picture.split(";")?.[2].substr(7);
  });
};

export const universityIdMap = new Map<string, number>();
universityIdMap.set("University of Central Florida", 1);
universityIdMap.set("University of Florida", 1);
universityIdMap.set("Florida State University", 1);

export const ACCOUNT_TYPE_DROPDOWN = ["Super Admin", "Student"];

export const UNIVERSITY_DROPDOWN = [
  "University of Central Florida",
  "University of Florida",
  "Florida State University",
];

export enum AccountTypes {
  SUPER_ADMIN = "Super Admin",
  STUDENT = "Student",
}

export enum FieldType {
  DROP_DOWN = "dropDown",
  TEXT_FIELD = "textField",
  IMAGE_UPLOAD = "imageUploader",
}

export const formMap = new Map<string, string>();
formMap.set("Select account type", "accountType");
formMap.set("Select your University", "university");
formMap.set("First name", "firstname");
formMap.set("Last name", "lastname");
formMap.set("Email", "email");
formMap.set("Password", "password");
formMap.set("Confirm password", "confirmPassword");
