import "./index.css";

import ucfLogo from "../../../images/ucf_logo_login.png";

const LoginImage = () => {
  return (
    <div>
      <img
        src={ucfLogo}
        alt="UCF Logo"
        width={50}
        height={75}
        className="ucf-logo-login"
      />
    </div>
  );
};

export default LoginImage;
