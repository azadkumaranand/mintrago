import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Inputcontrol from "./Inputcontrol";
import "./inputcontrol.css";
import { FaWindowClose } from "react-icons/fa";
// import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";
// import firebase from 'firebase/compat/app';
import "./navbar.css";
import { sendPasswordResetEmail } from "firebase/auth";

function Passwordreset() {
  const navigate = useNavigate();
  const [signupBtnDissabled, setSignupBtnDissabled] = useState(false);
  const [resetEmailSent, setresetEmailSent] = useState(false)
  // const [errormessage, seterrormessage] = useState("");
  const [values, setValues] = useState({
    email: "",
    pass: "",
  });

  const handlesubmission = async () => {
    setSignupBtnDissabled(true);
    await sendPasswordResetEmail(auth, values.email)
    setSignupBtnDissabled(false);
    setresetEmailSent(true)
  };

  const closergwindow = () => {
    navigate("/");
  };

  return (
    <div className="loginContainer">
      <div className="innerbox">
        <p className="rgclose" onClick={closergwindow}>
          {" "}
          <FaWindowClose />{" "}
        </p>
        <p className="loginhead">Reset Your Password</p>
        {resetEmailSent && (<p>Password reset link sent to your email.</p>)}
        <Inputcontrol
          onChange={(e) =>
            setValues((prev) => ({ ...prev, email: e.target.value }))
          }
          label="Email"
          placeholder="Enter Your Email"
        />
        
        <div className="footerlog">
        {!resetEmailSent && <Button
            className="mintragoBtn"
            onClick={handlesubmission}
            disabled={signupBtnDissabled}
          >
            Reset Password
          </Button>}
        </div>
        {/* <div className='errormessage'>
          {errormessage}
        </div> */}
      </div>
    </div>
  );
}

export default Passwordreset;
