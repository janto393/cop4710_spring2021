import "./index.css";

import ucfLogo from "../../../../images/ucf_logo_login.png";

const LoginImage = () => {
  return (
    <div>
      <img
        src={ucfLogo}
        alt="UCF Logo"
        width={200}
        height={300}
        className="ucf-logo-login"
      />
    </div>
  );
};

export default LoginImage;
