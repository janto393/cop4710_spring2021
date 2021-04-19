import { FieldType, formMap } from "../../Utils/formUtils";
import StudForm, { FormFieldType } from "../StudForm";

import { FormInputType } from "../LoginForm";
import { StudUser } from "src/hooks/useStudUser";
import produce from "immer";
import { useState } from "react";
import { CreateRsoRequest } from "src/types/apiRequestBodies";
import { CreateRsoReponse } from "src/types/apiResponseBodies";
import { useLoadingUpdate } from "src/Context/LoadingProvider";

// util imports
import buildpath from "../../Utils/buildpath";

export type RegisterRsoFormType = {
  studUser: StudUser;
  setIsValid: Function;
  setCanDisplayToast: Function;
};

const INITIAL_FORM_STATE = {
  rsoName: {
    value: "",
  },
  member1: {
    value: "",
  },
  member2: {
    value: "",
  },
  member3: {
    value: "",
  },
  member4: {
    value: "",
  },
  member5: {
    value: "",
  },
};

const RegisterRsoForm: React.FC<RegisterRsoFormType> = (
  props: RegisterRsoFormType
) => {
  const { studUser, setIsValid, setCanDisplayToast } = props;
  const { email, universityID } = studUser;
  const universityEmailDomain = email.split("@")[1];
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const setIsLoading = useLoadingUpdate();

  const isFormValid = (): boolean => {
    const { member1, member2, member3, member4, member5 } = form;
    const memberEmails = [
      member1.value,
      member2.value,
      member3.value,
      member4.value,
      member5.value,
    ];

    return !memberEmails
      .map((email) => {
        return email.split("@")[1] === universityEmailDomain;
      })
      .some((value) => value === false);
  };

  const handleChange = (field: string, update: FormInputType) => {
    const mappedField: any = formMap.get(field);

    const updatedForm = produce((form) => {
      form[mappedField] = update;
    });
    setForm(updatedForm);
  };

  const submitRsoRequest = () => {
    setIsLoading(true);

    if (isFormValid()) {
      setIsValid(true);

      let payload: CreateRsoRequest = {
        universityID: universityID,
        name: form.rsoName.value,
      };

      let request: Object = {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      };

      fetch(buildpath("/api/createRSO"), request)
        .then(
          (response: Response): Promise<CreateRsoReponse> => {
            return response.json();
          }
        )
        .then((data: CreateRsoReponse): void => {
          if (!data.success) {
            console.error(data.error);
            return;
          }

          console.log("RSO created successfully");
        });
    } else {
      setIsValid(false);
    }

    setCanDisplayToast(true);
    setIsLoading(false);
  };

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
      handleChange={handleChange}
      handleClick={submitRsoRequest}
    />
  );
};

export default RegisterRsoForm;
