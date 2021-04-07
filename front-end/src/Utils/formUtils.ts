export const getEventImages = (files: File[], pictures: string[]): string[] => {
  return pictures.map((picture) => {
    return picture.split(";")?.[2].substr(7);
  });
};

export const universityIdMap = new Map<string, number>();
universityIdMap.set("University of Central Florida", 1);
universityIdMap.set("University of Florida", 2);
universityIdMap.set("Florida State University", 3);

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
