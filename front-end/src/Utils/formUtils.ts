export const getEventImages = (files: File[], pictures: string[]): string[] => {
  return pictures.map((picture) => {
    return picture;
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

// map form field names to form variable names
export const formMap = new Map<string, string>();
formMap.set("Select account type", "accountType");
formMap.set("Select your University", "university");
formMap.set("First name", "firstname");
formMap.set("Last name", "lastname");
formMap.set("Email", "email");
formMap.set("Password", "password");
formMap.set("Confirm password", "confirmPassword");
formMap.set("Address", "address");
formMap.set("Capacity", "capacity");
formMap.set("City", "city");
formMap.set("Event Description", "eventDescription");
formMap.set("Event Name", "eventName");
formMap.set("Meeting Type", "meetingType");
formMap.set("Private Event", "isPrivateEvent");
formMap.set("RSO", "rso");
formMap.set("Room", "room");
formMap.set("State", "state");
formMap.set("University", "university");
formMap.set("Zip", "zip");
formMap.set("RSO Name", "rsoName");
formMap.set("Member 1", "member1");
formMap.set("Member 2", "member2");
formMap.set("Member 3", "member3");
formMap.set("Member 4", "member4");
formMap.set("Member 5", "member5");
formMap.set("University name", "name");
formMap.set("Address", "address");
formMap.set("City", "city");
formMap.set("State", "state");
formMap.set("Zip code", "zipCode");
formMap.set("Description", "description");
formMap.set("Phone number", "phoneNumber");
formMap.set("Campus pictures", "campusPics");
