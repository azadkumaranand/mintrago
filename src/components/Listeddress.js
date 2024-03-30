import React, { useState } from "react";
import "./sellproduct.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
// import { Link } from "react-router-dom";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "./Firebase";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import "./inputcontrol.css";
import Inputcontrol from "./Inputcontrol";
// import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

function Listeddress() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [show1, setShow2] = useState(false);
  const handleClose1 = () => setShow(false);

  const [loader, setLoader] = useState(false);

  const userData = useSelector((state) => {
    return state.activeUser;
  });
  // const dateTimes = useSelector((state) => {
  //   return state.dateTime;
  // });
  const date = new Date();
  const CurrentHour = date.getHours();
  const CurrentMinutes = date.getMinutes();
  const Time = `${CurrentHour}:${CurrentMinutes}`;
  const month = date.getMonth();
  const todaydate = date.getDate();
  const year = date.getFullYear();
  const dateString = `${month + 1}/${todaydate}/${year}`;
  // console.log(dateTimes)
  // const [loader, setLoader] = useState(false);
  const dressListedData = useSelector((state) => {
    return state.listedDressData;
  });
  const orderedDressData = useSelector((state) => {
    return state.dressOrderData;
  });
  const [renderDetails, setRenderDetails] = useState({
    rendterName: "",
    renterEmail: "",
    dressName: "",
    renterPhone: "",
    hostel: "",
    roomNo: "",
    renterId: "",
    dress_size: "",
  });
  const [dressType, setDressType] = useState("");
  const [dressSize, setDressSize] = useState(0);

  const [acceptUser, setAcceptUser] = useState(false);
  const [errormessage, seterrormessage] = useState("");
  // const [orderId, setOrderId] = useState("");

  //stripe
  // const stripe = new Stripe('your_stripe_publishable_key');

  // console.log(dressListedData)
  // debugger;
  const orderAlreadyExist =
    Array.isArray(orderedDressData) && orderedDressData.length > 0
      ? orderedDressData.filter((item) => {
          const userEmail = userData.email === item.email;
          const dressName = renderDetails.dressName === item.dressName;
          const dressSize = renderDetails.dress_size === item.dress_size;
          const docId = item.docId;
          // if (docId) {

          //   console.log(`${renderDetails.dressName}" " ${ item.dressName} " "${renderDetails.dress_size} " "${item.dress_size}`)
          //   console.log(userEmail, dressName, dressSize, docId)
          // }
          return userEmail && dressName && dressSize && docId;
        })
      : null;
  const filteredDress =
    Array.isArray(dressListedData) && dressListedData.length > 0
      ? dressListedData.filter((item) => {
          const dressNameMatches = item.dress_name
            .toLowerCase()
            .includes(dressType.toLowerCase());
          const dressSizeMatches = item.dressSize
            .toLowerCase()
            .includes(dressSize);
          const isNotCancelled = item.listingStatus !== "cancelListing";
          const MintraGoDress = item.hostel.toLowerCase().trim() === "mintrago";
          const isMale = item.gender === "male" || MintraGoDress;
          const isFemale = item.gender === "female" || MintraGoDress;
          // if (dressType === "" && dressSize === 0) {
          //   return true;
          // }
          if (userData.gender === "male") {
            if (dressType === "" && dressSize === 0) {
              return isNotCancelled && isMale; // Show all products except "cancelListing"
            } else if (dressType !== "" && dressSize === 0) {
              return dressNameMatches && isNotCancelled && isMale;
            } else if (dressType === "" && dressSize !== 0) {
              return dressSizeMatches && isNotCancelled && isMale;
            } else {
              return (
                dressNameMatches && dressSizeMatches && isNotCancelled && isMale
              );
            }
          }
          if (userData.gender === "female") {
            if (dressType === "" && dressSize === 0) {
              return isNotCancelled && isFemale; // Show all products except "cancelListing"
            } else if (dressType !== "" && dressSize === 0) {
              return dressNameMatches && isNotCancelled && isFemale;
            } else if (dressType === "" && dressSize !== 0) {
              return dressSizeMatches && isNotCancelled && isFemale;
            } else {
              return (
                dressNameMatches &&
                dressSizeMatches &&
                isNotCancelled &&
                isFemale
              );
            }
          }
          if (dressType === "" && dressSize === 0) {
            return isNotCancelled; // Show all products except "cancelListing"
          } else if (dressType !== "" && dressSize === 0) {
            return dressNameMatches && isNotCancelled;
          } else if (dressType === "" && dressSize !== 0) {
            return dressSizeMatches && isNotCancelled;
          } else {
            return dressNameMatches && dressSizeMatches && isNotCancelled;
          }
        })
      : [];

  const checkOrderConfermation = (item) => {
    // console.log(item.id);
    setRenderDetails({
      rendterName: item.Name ? item.Name : "Name",
      renterEmail: item.email ? item.email : "Email",
      dressName: item.dress_name ? item.dress_name : "Dress Name",
      renterPhone: item.phone ? item.phone : "",
      hostel: item.hostel ? item.hostel : "",
      renterId: item.id ? item.id : "",
      renterRoom: item.Room_No ? item.Room_No : "",
      dress_size: item.dressSize ? item.dressSize : "",
      rented: item.rendted ? item.rendted : "",
    });
    setShow(true);
  };
  const placedConfirmOrder = async () => {
    if (!userData.Name || !userData.email || !userData.phone) {
      alert("You are not Registered!");
      navigate("/signup");
      return;
    }
    if (!acceptUser) {
      seterrormessage("Please accept terms & conditions");
      return;
    } else {
      seterrormessage("");
    }
    if (orderAlreadyExist && orderAlreadyExist.length > 0) {
      console.log(orderAlreadyExist);
      const matchingDocId = orderAlreadyExist.map((item) => item.docId);
      // console.log(matchingDocId)
      // console.log("exist")
      const washionRef = doc(db, "DressOrders", matchingDocId[0]);
      setLoader(true);
      await updateDoc(washionRef, {
        OrderStatus: "status",
      });
      const washionRef1 = doc(db, "ListedDress", orderAlreadyExist[0].renterId);
      await updateDoc(washionRef1, {
        rendted: true,
        userOrderId: matchingDocId[0],
      });
      setLoader(false);
      setShow(false);
      setShow2(true);
      window.location.reload();
      return;
    }
    console.log("object");
    try {
      setLoader(true);
      const newOrderRef = await addDoc(collection(db, "DressOrders"), {
        ...renderDetails,
        ...userData,
        orderDate: dateString ? dateString : "",
        orderTime: Time ? Time : "",
        OrderStatus: "status",
        rented: true,
      });
      // console.log("hello1");
      const washionRef = doc(db, "ListedDress", renderDetails.renterId);
      await updateDoc(washionRef, {
        rendted: true,
        userOrderId: newOrderRef.id,
      });
      setLoader(false);
      setShow(false);
      setShow2(true);
      window.location.reload();
    } catch (error) {
      seterrormessage("something went wrong");
    }
  };
  // console.log(userData);

  return (
    <>
      {loader && <Loader />}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Hey {userData.currentusername}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Confirm your order <br />
          You can see your orders details in Your Account <br />
          <div className="checkbox inputfield">
            <label>
              <input
                type="checkbox"
                checked={acceptUser}
                onChange={(e) => {
                  setAcceptUser(e.target.checked);
                }}
              />
              <span style={{ color: "black" }}>
                Accept{" "}
                <a
                  href="https://drive.google.com/file/d/1JuVy4QdyFSXEZxe2rWCU6RgbtWNT-Emj/view?usp=drivesdk"
                  target="_blank"
                  rel="noreferrer"
                >
                  Terms & Conditions
                </a>
              </span>
            </label>
          </div>
          <div className="errormessage">{errormessage ? errormessage : ""}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="mintragoBtn" onClick={placedConfirmOrder}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>Hey {userData.currentusername}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Congratulations! your dress placed <br /> check your Account
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="mintragoBtn"
            onClick={() => {
              setShow2(false);
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <div
        className="row container d-flex justify-content-center align-items-center m-auto rounded-2"
        style={{
          position: "relative",
          top: "100px",
          backgroundColor: "#00FFFF",
        }}
      >
        <div className="row d-flex justify-content-center align-items-center m-auto p-2">
          <h3 className="text-dark">
            MECHANICAL DRESS : Rs. 18 & LAB COAT: Rs. 12 FOR A LAB
          </h3>
          <h4>Filter Dress</h4>
          <div className="col-md-6">
            <div className="modalField inputfield w-100">
              <p className="text-dark mb-2">Select dress type</p>
              <select
                value={dressType}
                onChange={(event) => setDressType(event.target.value)}
              >
                <option value="">Select Your Dress Type</option>
                <option value="MechDress">Mechanical Dress</option>
                <option value="LabCoat">Lab Coat</option>
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="inputfield w-100">
              <Inputcontrol
                label="Dress Size"
                placeholder="Size"
                type="number"
                onChange={(e) => setDressSize(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className="d-flex justify-content-center align-items-center flex-wrap dresCarContainer"
        style={{ margin: "100px 0" }}
      >
        {filteredDress.length > 0 ? (
          filteredDress.map((item, index) => (
            <Card key={item.id} className="mx-4 my-3 card dressCard">
              {item.dress_name === "MechDress" ? (
                <Card.Img
                  className="dressCardimg"
                  variant="top"
                  src="images/mechdress.png"
                />
              ) : (
                <Card.Img
                  className="dressCardimg"
                  variant="top"
                  src="images/cheapron.png"
                />
              )}
              <Card.Body>
                {/* <Card.Title>{item.dress_name}</Card.Title> */}
                {item.hostel.toLowerCase().trim() === "mintrago" && (
                  <>
                    <Card.Text>
                      Renter: <strong> MintraGo</strong>{" "}
                    </Card.Text>
                    <Card.Text>
                      Size: <strong> {item.dressSize.split(" ")[0]}</strong>{" "}
                    </Card.Text>
                    <Card.Text>
                      Deliver to:<strong> Your Hostel</strong>
                    </Card.Text>
                  </>
                )}
                {item.hostel.toLowerCase().trim() !== "mintrago" && (
                  <>
                    <Card.Text>
                      Renter: <strong> {item.Name}</strong>{" "}
                    </Card.Text>
                    <Card.Text>
                      Size: <strong> {item.dressSize.split(" ")[0]}</strong>{" "}
                    </Card.Text>

                    <Card.Text>
                      Hostel:<strong> {item.hostel}</strong>
                    </Card.Text>
                  </>
                )}
                {/* <Card.Text>Size: {item.Room_No}</Card.Text> */}
                {/* <Link to={`/singleproduct/${item.dressSize}`}><Button variant="info">See Details</Button></Link> */}

                {!item.rendted && (
                  <Button
                    variant="info"
                    onClick={() => checkOrderConfermation(item)}
                  >
                    Order Now
                  </Button>
                )}
                {item.rendted && (
                  <span
                    className="text-danger rounded-2 h2"
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "0",
                      backgroundColor: "#b3b1b1",
                    }}
                  >
                    Rented
                  </span>
                )}
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>Loading.....</p>
        )}
      </div>
    </>
  );
}

export default Listeddress;
