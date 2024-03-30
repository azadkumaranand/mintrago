import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Inputcontrol from "./Inputcontrol";
import "./inputcontrol.css";
import { FaWindowClose } from "react-icons/fa";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { db } from "./Firebase";
import { collection, addDoc } from "firebase/firestore";
// import Modal from "react-bootstrap/Modal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loader from "./Loader";
// import { Checkbox, CheckboxGroup } from '@chakra-ui/react'

function Signup() {
  const navigate = useNavigate();
  const [signupBtnDissabled, setSignupBtnDissabled] = useState(false);
  const [errormessage, seterrormessage] = useState("");
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);
  const [loader, setLoader] = useState(false)
  // const [show2, setShow2] = useState(false);
  // const handleClose2 = () => setShow2(false);
  // const [alertmessage, setalertmessage] = useState("");
  const [userData, setuserData] = useState({
    name: "",
    phone: "",
    email: "",
    gender: ""
  });
  const [error, setError] = useState({
    nameError: "",
    phoneError: "",
    emailError: "",
    passError: "",
  });
  const [emailError, setEmailerror] = useState(false);
  const [phoneError, setphoneError] = useState(false);
  const [nameError, setnameError] = useState(false);
  const [passError, setpassError] = useState(false);


  const [gender, setGender] = useState(false);
  

  const [showPassword, setShowPassword] = useState(false);

  function handleTogglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  const setMoreData = async (userName, userEmail, userPhone) => {
    try {
      setLoader(true);
      await addDoc(collection(db, "users"), {
        currentusername: String(userName),
        currentuserphone: String(userPhone),
        currentuseremail: String(userEmail),
        gender: String(gender),
      });
      setLoader(false)
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // const emailPattern = /^[0-9]{4}[a-zA-Z]{3}[0-9]{4}@mnit\.ac\.in$/;
  const namepattern = /^[a-zA-Z\s'-]+$/;
  const phonepattern = /^[+]?[0-9-() ]{10,}$/;
  const passpattern = /^.{6,}$/;

  const handlesubmission = async (event) => {
    event.preventDefault();

    if (
      !userData.name ||
      !userData.email ||
      !userData.phone ||
      !userData.pass
    ) {
      seterrormessage("Please fill all the credentials!");
      return;
    }
    if(!gender){
      seterrormessage("Please select gender")
      return
    }
    
    // if (!emailPattern.test(userData.email)) {
    //   setError({emailError:"Please enter your college ID"});
    //   setEmailerror(true);
    //   return;
    // }
    // else{
    //   setEmailerror(false);
    // }
    // if (!emailPattern.test(userData.name)) {
    //   setError({emailError:"Please enter your college ID"});
    // }
    // if (!emailPattern.test(userData.phone)) {
    //   setError({emailError:"Please enter your college ID"});
    // }

    seterrormessage("");
    setSignupBtnDissabled(true);

    const auth = getAuth();

    try {
      // Create user account
      
      try {
        setLoader(true)
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email.toLowerCase(),
          userData.pass
        );
        const user = userCredential.user;

        // Set display name
        await updateProfile(user, {
          displayName: userData.name,
        });
        setLoader(false)
        
      } catch (error) {
        seterrormessage(error.message)
      }

      // Send email verification
      await sendEmailVerification(auth.currentUser);
      setEmailSentSuccess(true);
      await setMoreData(userData.name, userData.email.toLowerCase(), userData.phone);
      setuserData({
        name: "",
        phone: "",
        email: "",
        gender: ""
      });
      setLoader(false)
      setSignupBtnDissabled(false);
    } catch (error) {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      seterrormessage("Email already exist")
      setSignupBtnDissabled(false);
      // Handle error
    }
  };

  const closergwindow = () => {
    navigate("/");
  };
  console.log(gender)
  let name, value;
  const postUserData = (e) => {
    name = e.target.name;
    value = e.target.value;
    // if (name === 'email' && !emailPattern.test(value)) {
    //   setError({emailError:"Please enter a valid college ID"});
    //   setEmailerror(true);
    // }else{
    //   setEmailerror(false);
    // }
    if (name === "name" && !namepattern.test(value)) {
      setError({ nameError: "Please enter a valid name" });
      setnameError(true);
    } else {
      setnameError(false);
    }
    if (name === "phone" && !phonepattern.test(value)) {
      setError({ phoneError: "Please enter valid number" });
      setphoneError(true);
    } else {
      setphoneError(false);
    }
    if (name === "pass" && !passpattern.test(value)) {
      setError({ passError: "Password should be at least 6 character" });
      setpassError(true);
    } else {
      setpassError(false);
    }
    setuserData({
      ...userData,
      [name]: value,
    });
  };


  return (
    <>
    {loader && <Loader/>}
      <div className="loginContainer">
        <div className="innerbox">
          <p className="rgclose" onClick={closergwindow}>
            {" "}
            <FaWindowClose />{" "}
          </p>
          <p className="loginhead">Register Your Self</p>
          {emailSentSuccess && (
            <div className="bg-success p-3 text-white rounded-2 d-flex justify-content-center align-items-center">
              <p className="text-center h5">
                Email sent to you successfully.
                <br />
                Please check email box and verify your email
              </p>
            </div>
          )}

          <Inputcontrol
            onChange={postUserData}
            value={userData.name}
            label="Name"
            name="name"
            placeholder="Enter Your Name:"
          />
          {nameError && <p className="text-danger">{error.nameError}</p>}
          <Inputcontrol
            onChange={postUserData}
            value={userData.phone}
            label="Phone"
            name="phone"
            placeholder="Enter Phone No:"
          />
          {phoneError && <p className="text-danger">{error.phoneError}</p>}
          <Inputcontrol
            onChange={postUserData}
            value={userData.email}
            label="College Email Id"
            name="email"
            placeholder="Enter College Eamil Id:"
          />
          {emailError && <p className="text-danger">{error.emailError}</p>}
          <div style={{ position: "relative" }}>
            <Inputcontrol
              onChange={postUserData}
              value={userData.pass}
              label="Password"
              name="pass"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password:"
            />
            {passError && <p className="text-danger">{error.passError}</p>}
            <button
              type="button"
              className="eyetogglesign"
              onClick={handleTogglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          <div className="radiobtn">
            <p>Gender</p>
          <label>
              <input
                type="radio"
                value="male"
                checked={gender === "male"}
                onChange={(e)=>{setGender(e.target.value)}}
              />
              <span style={{ color: "black", marginLeft: "5px" }}>Male</span>
            </label>
            <label className="mx-3">
              <input
                type="radio"
                value="female"
                checked={gender === "female"}
                onChange={()=>{setGender("female")}}
              />
              <span style={{ color: "black", marginLeft: "5px"}}>Female</span>
            </label>
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
              SignIn
            </Button>
            <p>
              Already have an account?
              <span>
                <Link to="/login">Login</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
