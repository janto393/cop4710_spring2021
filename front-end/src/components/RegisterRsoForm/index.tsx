import StudForm, { FormFieldType } from "../StudForm";

import { FieldType } from "../../Utils/formUtils";

export type RegisterRsoFormType = {};

const RegisterRsoForm: React.FC<RegisterRsoFormType> = (
  props: RegisterRsoFormType
) => {
  const formFields: Array<FormFieldType> = [
    { fieldTitle: "RSO Name", fieldType: FieldType.TEXT_FIELD },
    { fieldTitle: "Member 1", fieldType: FieldType.TEXT_FIELD },
    { fieldTitle: "Member 2", fieldType: FieldType.TEXT_FIELD },
    { fieldTitle: "Member 3", fieldType: FieldType.TEXT_FIELD },
    { fieldTitle: "Member 4", fieldType: FieldType.TEXT_FIELD },
    { fieldTitle: "Member 5", fieldType: FieldType.TEXT_FIELD },
  ];
  return (
    <StudForm
      title="Register RSO"
      formFields={formFields}
      buttonText="Register"
      handleChange={() => null}
      handleClick={() => null}
    />
  );
};

export default RegisterRsoForm;
