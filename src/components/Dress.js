import React, { useState, useEffect } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min";
import "./dress.css";
import "./stationary.css";
import Footer from "./Footer";
import Inputcontrol from "./Inputcontrol";
import "./inputcontrol.css";
import { db } from "./Firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { useSelector } from "react-redux";

export default function Dress() {
  const [dressSize, setdressSize] = useState();
  const [hostelNo, sethostelNo] = useState("");
  const [deliveryType, setdeliveryType] = useState("");
  const [show, setShow] = useState(false);
  const [dressPrice, setdressPrice] = useState();
  const [dressType, setdressType] = useState("none");
  const handleClose = () => setShow(false);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [selectedValue, setSelectedValue] = useState();
  const [alertmessage, setalertmessage] = useState(false);

  const userData = useSelector((state) => {return state.activeUser});
  const date_time = useSelector((state) => {return state.dateTime});

  //handle which payment method user selected
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const dressDetails = (item) => {
    setShow(true);
    setdressType(item);
  };
  const paymentMethod = () => {
    // setmodalalert(true)
    if (!dressSize || !deliveryType) {
      setalertmessage("Please fill Dress Size and Delivery Type")
      setShow2(true)
      return;
    } else {
      if (hostelNo === "") {
        setalertmessage("Please fill Hostel No and Lab timing")
        setShow2(true)
        return;
      }
    }
    setShow(false);
    setShow1(true);
    if (deliveryType === "DeliveryToHostel" && dressType === "mechdress") {
      setdressPrice(30);
    }
    if (deliveryType === "DeliveryToHostel" && dressType === "labcoat") {
      setdressPrice(20);
    }
    if (deliveryType === "MintraGoCCentre" && dressType === "mechdress") {
      setdressPrice(20);
    }
    if (deliveryType === "MintraGoCCentre" && dressType === "labcoat") {
      setdressPrice(15);
    }
  };

  const status = "status";

  const cashPaymentDress = async () => {
    if (!userData.Name || !userData.email || !userData.phone) {
      setalertmessage("you are not loggedIn!");
      setShow2(true)
      return;
    } else {
      try {
        addDoc(collection(db, "DressOrders"), {
          ...userData,
          DressSize: dressSize,
          Dressname: dressType,
          hostel_No: hostelNo,
          Date: date_time.date,
          Time: date_time.time,
          Delivery: deliveryType,
          Status: status,
          Paidamount: 0,
          OrderStatus: "good",
        });
        setalertmessage(
          `Hi ${userData.Name}, Your Order Placed successfully!`
        );
        setShow2(true)
        handleClose1();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  const loadscript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  async function displayRazorpay(docId) {
    const res = await loadscript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert("you are offline");
      return;
    }
    const options = {
      key: "rzp_live_njkK5E6B4apxte",
      amount: dressPrice * 100,
      currency: "INR",
      name: "MintraGo",
      description: "Motive To Solve Students College Problems",
      image: "https://mintrago.in/images/mintragologo.png",
      "theme-color": "#528FF0",
      handler: function (response) {
        const washingtonRef = doc(db, "dressOrderOnline", docId);
        updateDoc(washingtonRef, {
          payment_id: response.razorpay_payment_id,
        })
          .then(() => {
            setalertmessage(
              `Hi ${userData.Name}, Your Payment successfully!`
            );
            setShow2(true)
            handleClose1();
          })
          .catch((err) => alert("your payment is unsuccessfull"));
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  const onlinePaymentCycle = async () => {
    if (!userData.Name || !userData.email || !userData.phone) {
      setalertmessage("you are not loggedin!");
      setShow2(true)
    } else {
      try {
        addDoc(collection(db, "dressOrderOnline"), {
          ...userData,
          DressSize: dressSize,
          Dressname: dressType,
          hostel_No: hostelNo,
          payment_id: "paymentId",
          Date: date_time.date,
          Time: date_time.Time,
          Delivery: deliveryType,
        }).then(function (docRef) {
          displayRazorpay(docRef.id);
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  const orderplaced = () => {
    if (userData.email !== "") {
      if (selectedValue === "cash") {
        cashPaymentDress();
        setSelectedValue();
        handleClose1();
      } else if (selectedValue === "online") {
        onlinePaymentCycle();
        setSelectedValue();
        handleClose1();
      }else{
        setalertmessage("Please select payment method!")
        setShow2(true)
        return;
      }
    } else {
      setalertmessage("Please logIn before placing orders!");
      setShow2(true)
    }

    
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Fill These Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modalField">
            <select
              value={dressSize}
              onChange={(event) => setdressSize(event.target.value)}
            >
              <option value="none">Select Your Dress Size</option>
              <option value="28">28</option>
              <option value="30">30</option>
              <option value="32">32</option>
              <option value="34">34</option>
              <option value="36">36</option>
              <option value="38">38</option>
              <option value="40">40</option>
            </select>
          </div>
          <div className="modalField">
            <select
              value={deliveryType}
              onChange={(e) => setdeliveryType(e.target.value)}
            >
              <option value="selectdelivery">Select Delivery Type</option>
              <option value="DeliveryToHostel">Delivery To My Hostel</option>
              <option value="MintraGoCCentre">MintraGo Centre</option>
            </select>
          </div>
          <div className="modalField">
            <Inputcontrol
              onChange={(e) => sethostelNo((prev) => e.target.value)}
              label="Enter Your Hostel No And Lab Timing"
              placeholder="Enter Here...."
              required
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="mintragoBtn" onClick={paymentMethod}>
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>Choose Payment Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="readioinputs">
            <p>
              <input
                type="radio"
                className="radioInput"
                name="paymenttype"
                value="cash"
                onChange={handleChange}
              />
              <span>Cash On Delivery</span>
            </p>
            <p>
              <input
                type="radio"
                className="radioInput"
                name="paymenttype"
                value="online"
                onChange={handleChange}
              />
              <span>Pay Online</span>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="mintragoBtn" onClick={orderplaced}>
            Place Order
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Hey Dear</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alertmessage}
        </Modal.Body>
        <Modal.Footer>
          <Button className="mintragoBtn" onClick={handleClose2}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="container py-3 stationaryservices">
        <div className="accordion accordion-flush" id="accordionFlushExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="flush-headingOne">
              <button
                className="accordion-button btn collapsed bg-dark text-light"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                Terms and conditions on dress &nbsp;&nbsp; <i> Read more....</i>
              </button>
            </h2>
            <div
              id="flush-collapseOne"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingOne"
              data-bs-parent="#accordionFlushExample"
            >
              <div className="accordion-body">
                <ol>
                  <li>You must book your dress before a day of your lab.</li>
                  <li>We have two way to provide your dress</li>
                  <ul>
                    <li>
                      MintraGo delivery : In this way MintraGo deliver your
                      dress on your hostel room before 8:00 a.m and will collect
                      it before 6:00pm.
                    </li>
                    <li>
                      {" "}
                      MintraGo centers : In this way you can collect your dress
                      from MintraGo centers will be H-8 and H-2
                    </li>
                  </ul>
                  <li>It is your responsibility to take care of your dress.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="stationarycontent py-3">
          <div className="card mx-2 my-3" style={{ width: "18rem" }}>
            <img src="../images/cheapron.png" className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Chemical Lab Dress</h5>
              <p className="card-text">chemical dress on Rent</p>
              <button
                onClick={() => dressDetails("labcoat")}
                className="btn btn-info my-2 mx-2"
              >
                Proceed
              </button>
            </div>
          </div>
          <div className="card mx-2 my-3" style={{ width: "18rem" }}>
            <img
              src="../images/mechdress.png"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <h5 className="card-title">Mechanical Lab Dress</h5>
              <p className="card-text">Mechanical dress on Rent</p>
              <button
                onClick={() => dressDetails("mechdress")}
                className="btn btn-info my-2 mx-2"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <Footer />
      </div>
    </>
  );
}
