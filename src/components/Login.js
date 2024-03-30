import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Inputcontrol from "./Inputcontrol";
import "./inputcontrol.css";
import { FaWindowClose } from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";
// import firebase from 'firebase/compat/app';
import "./navbar.css";
import Loader from './Loader'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";

function Login() {
  const navigate = useNavigate();
  const [signupBtnDissabled, setSignupBtnDissabled] = useState(false);
  const [errormessage, seterrormessage] = useState("");
  const [values, setValues] = useState({
    email: "",
    pass: "",
  });
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [alertmessage, setalertmessage] = useState(false);
  const [notEmailVerified, setNotEmailVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loader, setLoader] = useState(false);
  function handleTogglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  const handlesubmission = async () => {
    if (!values.email || !values.pass) {
      seterrormessage("Please fill all the credentials");
      return;
    }
    seterrormessage("");
    setSignupBtnDissabled(true);
    setLoader(true)
    try { 
      await signInWithEmailAndPassword(
        auth,
        values.email.toLowerCase(),
        values.pass
      );
    } catch (error) {
      seterrormessage("Invalid Credentials")
    }
    
    setLoader(false)
    const user = auth.currentUser;
    if (user && user.emailVerified) {
      setSignupBtnDissabled(false);
      navigate("/");
      window.location.reload();
    } else {
      // Prompt the user to verify their email before logging in
      setNotEmailVerified(true)
      console.log("verified your eamil");
      setSignupBtnDissabled(false);
      setalertmessage("Please check your email box and varify your eamil");
      setShow2(true);
    }
  };

  const closergwindow = () => {
    navigate("/");
  };

  return (
    <>
    {loader && <Loader/>}
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Hey Dear</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alertmessage}</Modal.Body>
        <Modal.Footer>
          <Button className="mintragoBtn" onClick={handleClose2}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="loginContainer">
        <div className="innerbox">
          <p className="rgclose" onClick={closergwindow}>
            {" "}
            <FaWindowClose />{" "}
          </p>
          <p className="loginhead">Login Here</p>
          {notEmailVerified && (<div className="bg-danger p-3 text-white rounded-2 d-flex justify-content-center align-items-center">
            <p className="text-center h5">Before loggedIn, please verify you email.<br/> check you email box</p>
          </div>)}
          <Inputcontrol
            onChange={(e) =>
              setValues((prev) => ({ ...prev, email: e.target.value }))
            }
            label="Email"
            placeholder="Enter Your Email"
          />
          <label>Password</label>
          <div>
            <div style={{position:"relative"}}>
              <Inputcontrol
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={values.pass}
                label="Password"
                placeholder="Enter password"
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, pass: e.target.value }))
                }
              />
              <button type="button" className="eyetogglesign" onClick={handleTogglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            </div>
          </div>

          <div className="errormessage">
            {errormessage ? errormessage : ""}
          </div>
          <div className="footerlog">
            <Button
              className="mintragoBtn"
              onClick={handlesubmission}
              disabled={signupBtnDissabled}
            >
              Login
            </Button>
            <p>
              I don not have an account? {""}
              <span>
                <Link to="/signup">Sign up</Link>
              </span>
            </p>
            <p>
              Forgot Password
              <span>
                <Link to="/passreset">Reset</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
