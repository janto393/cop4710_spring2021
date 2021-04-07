// fields that should be passed into formField
export type FormFieldType = {
  fieldTitle: string;
  fieldType: "textField" | "dropDown" | "imageUploader";
  handleOnChange: Function;
  inputTypePassword?: boolean;
  selectItems?: Array<string>;
};
