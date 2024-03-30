import React, { useEffect, useState } from "react";
import "./navbar.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

// import { useSelector, useDispatch } from "react-redux";
// import { addTodo, removeTodo } from "../store/testSlice";

// import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Footer from "./Footer";
import Homecontent from "./HomeApi";
import { auth, db } from "./Firebase";
import { format, parse } from 'date-fns';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { FaPhoneSquareAlt, FaEnvelope } from "react-icons/fa";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Inputcontrol from "./Inputcontrol";
import $ from "jquery";
import { useSelector } from "react-redux";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import "./inputcontrol.css";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [mintragomember, setMintragomem] = useState(false);
  const [DressOrders, setDressOrders] = useState();
  const [DressOrdersOnline, setDressOrdersOnline] = useState();
  const [CycleOrders, setCycleOrders] = useState();
  const [CycleOrdersOnline, setCycleOrdersOnline] = useState();
  const [currentUser, setcurrentUser] = useState("");
  const [normalUserLogin, setnormalUserLogin] = useState(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const [status, setStatus] = useState("paid");
  const [amount, setAmount] = useState(0);
  const [sumtotalamount, setsumtotalamount] = useState();
  const [docId, setdocId] = useState();
  const [delDocId, setDeldocId] = useState();
  const today = new Date();
  const [searchResult, setSearchResult] = useState();
  const [onlineSearch, setonlineSearch] = useState();
  const locale = "en";
  const oneDaysAgo = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000);
  const prevDay = oneDaysAgo.toLocaleDateString(locale, { weekday: "long" });
  const day = today.toLocaleDateString(locale, { weekday: "long" });
  const prevDate = `${prevDay}, ${
    today.getDate() - 1
  } ${today.toLocaleDateString(locale, {
    month: "long",
  })}\n\n`;
  const currentDate = `${day}, ${today.getDate()} ${today.toLocaleDateString(
    locale,
    {
      month: "long",
    }
  )}\n\n`;
  const [selectedDate, setSelectedDate] = useState(null);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  $(document).ready(function () {
    $("#searchinput").on("keyup", function () {
      var value = $(this).val().toLowerCase();
      $("#onlineOrderSearch tr").filter(function () {
        return $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  });
  $(document).ready(function () {
    $("#searchinput1").on("keyup", function () {
      var value = $(this).val().toLowerCase();
      $("#cashOrdersSearch tr").filter(function () {
        return $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  });

  const DressOrderData = useSelector((state) => {
    return state.dressOrderData;
  });

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setcurrentUser(user.email);
      }
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      const DressOrders = [];
      const DressOrdersOnline = [];
      const CycleOrders = [];
      const CycleOrdersOnline = [];
      const querySnapshot = await getDocs(collection(db, "DressOrders"));
      const querySnapshot1 = await getDocs(collection(db, "dressOrderOnline"));
      const querySnapshot2 = await getDocs(collection(db, "CycleOrders"));
      const querySnapshot3 = await getDocs(collection(db, "CycleOrdersOnline"));
      querySnapshot.docs.forEach(async (doc) => {
        DressOrders.push({ ...doc.data(), id: doc.id });
      });
      querySnapshot1.docs.forEach(async (doc) => {
        DressOrdersOnline.push({ ...doc.data(), id: doc.id });
      });
      querySnapshot2.docs.forEach(async (doc) => {
        CycleOrders.push({ ...doc.data(), id: doc.id });
      });
      querySnapshot3.docs.forEach(async (doc) => {
        CycleOrdersOnline.push({ ...doc.data(), id: doc.id });
      });
      setDressOrders(DressOrders);
      setDressOrdersOnline(DressOrdersOnline);
      setCycleOrders(CycleOrders);
      setCycleOrdersOnline(CycleOrdersOnline);
      if (
        currentUser === "azadanand9798@gmail.com"
      ) {
        setnormalUserLogin(false);
        setMintragomem(true);
      } else {
        setnormalUserLogin(true);
        setMintragomem(false);
      }
    }
    fetchData();
  }, [currentUser]);
  

  const updateStatus = () => {
    const washingtonRef = doc(db, "DressOrders", docId);
    updateDoc(washingtonRef, {
      Status: status,
      Paidamount: amount,
    })
      .then(() => {
        alert("updated successfully");
      })
      .catch((err) => alert("your payment is unsuccessfull"));
    handleClose2();
  };

  const DeleteDoc = (id) => {
    setDeldocId(id);
    setShow3(true);
  };
  const confDeleteDoc = () => {
    const docRef = doc(db, "DressOrders", delDocId);
    setShow3(false);
    deleteDoc(docRef)
      .then(() => {
        alert("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };




  return (
    <>
      {mintragomember && (
        <>
        
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <div className="searchbtn">
                <input
                  onChange={(e) => setonlineSearch(e.target.value)}
                  type="text"
                  placeholder="search"
                  id="searchinput"
                />
              </div>
            </Modal.Header>
            <Modal.Body>
              <p className="headline1">Total Online Dress Orders</p>
              <div className="tablecontainer">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">S.No</th>
                      <th scope="col">Name</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Dress</th>
                      <th scope="col">Hostel</th>
                      <th scope="col">Payment Id</th>
                      <th scope="col">Date</th>
                    </tr>
                  </thead>
                  <tbody id="onlineOrderSearch">
                    {DressOrdersOnline.map((user, index) => {
                      return (
                        <tr key={user.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{user.Name}</td>
                          <td>
                            <a href={`tel:${user.phone}`}>
                              <span></span>
                              {user.phone}
                            </a>
                          </td>
                          <td>{user.Dressname}</td>
                          <td>{user.hostel_No}</td>
                          <td>{user.payment_id}</td>
                          <td>{user.Date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="mintragoBtn" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={show3} onHide={handleClose3}>
            <Modal.Header closeButton>Hey, Are You sure?</Modal.Header>
            <Modal.Body>You Want To Delete This Document</Modal.Body>
            <Modal.Footer>
              <Button className="mintragoBtn" onClick={confDeleteDoc}>
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={show1} onHide={handleClose1}>
            <Modal.Header closeButton>
              <div className="searchbtn">
                <input
                  onChange={(e) => setSearchResult(e.target.value)}
                  type="text"
                  placeholder="search"
                  id="searchinput1"
                  className="px-3 py-2"
                />
              </div>
            </Modal.Header>
            <Modal.Body>
              <p className="headline1">Total Dress Orders</p>
              <div className="tablecontainer">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">S.No</th>
                      <th scope="col">Name</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Dress</th>
                      <th scope="col">Hostel</th>
                      <th scope="col">Date</th>
                      <th scope="col">Status</th>
                      <th scope="col">Order Status</th>
                    </tr>
                  </thead>
                  <tbody id="cashOrdersSearch">
                    {DressOrders.map((user, index) => {
                      return (
                        <tr key={user.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{user.Name}</td>

                          <td>
                            <a href={`tel:${user.phone}`}>
                              <span></span>
                              {user.phone}
                            </a>
                          </td>
                          <td>{user.Dressname}</td>
                          <td>{user.hostel_No}</td>
                          <td>{user.Date}</td>
                          <td>{user.Status}</td>
                          <td>{user.OrderStatus}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="mintragoBtn" onClick={handleClose1}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={show2} onHide={handleClose2}>
            <Modal.Header closeButton>
              <Modal.Title>Hey Dear</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Inputcontrol
                onChange={(e) => setStatus(e.target.value)}
                label="Order Status"
                placeholder="Enter here"
              />
              <Inputcontrol
                onChange={(e) => setAmount(e.target.value)}
                label="Enter amount"
                placeholder="Enter here"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button className="mintragoBtn" onClick={updateStatus}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
      
      {(normalUserLogin || mintragomember) && (
        <>
          <div className="header my-6">
            <Carousel>
              <Carousel.Item className="crouselimg">
                <img
                  className="d-block w-100"
                  src="images/crausel1.jpg"
                  alt="Second slide"
                />

                <Carousel.Caption>
                  <h3 className="banner_title">Motive of MintraGo</h3>
                  <p className="banner_desc">
                    MintraGo will solve your basic problems so you can more
                    focus on your study and skill development
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item className="crouselimg">
                <img
                  className="d-block w-100"
                  src="images/cyclebaner.jpg"
                  alt="First slide"
                />
              </Carousel.Item>
              <Carousel.Item className="crouselimg">
                <img
                  className="d-block w-100"
                  src="images/crausel3.jpg"
                  alt="Third slide"
                />

                <Carousel.Caption>
                  {/* <h3 className="banner_title">MintraGo Team</h3>
                  <p className="banner_desc">
                    Azad Kumar, Devansh Nagar, Rajkumar Nagar, Avinish
                    Khandelwal
                  </p> */}
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>
          <div className="serhead my-3">
            Our Services{mintragomember && (
              <Link to="/admin" className="btn btn-info">
              <button className="btn btn-info px-3 py-2">Admin Pannel</button>
            </Link>
            
          )}
          </div>
          
          <div className="aftercrousel">
            <div className="serconatainer py-3">
              <div className="container services">
                {Homecontent.map((currentelm) => {
                  const { id, image, content, title, button, name, headline } =
                    currentelm;
                  return (
                    <div
                      className="card shadow-lg p-3 mb-5 rounded mx-4 my-2"
                      data-aos="flip-left"
                      key={id}
                      style={{ width: "35rem" }}
                    >
                      <img src={image} className="card-img-top" alt="..." />
                      <div className="card-body">
                        <h5 className="card-title fontstyle">{title}</h5>

                        <h6 className="card-text fontstyle text-secondary">
                          {headline}
                        </h6>
                        
                        <p className="card-text fontstyle">{content}</p>
                        <Link to={name} className="btn btn-info">
                          {button}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="container services" data-aos="flip-left">
                <div
                  className="card shadow-lg p-3 mb-5 rounded mx-4 my-2"
                  style={{ width: "35rem" }}
                >
                  <img
                    src="images/query.jpg"
                    className="card-img-top"
                    alt="..."
                  />
                  <div className="card-body">
                    <h5 className="card-title">Query Section</h5>

                    <h6 className="card-text text-secondary">
                      Pucho appane sara doubts
                    </h6>
                    <p className="card-text">
                      Get Answered your queries related to Lab coat, Mechanical
                      dress, and Cycles
                    </p>
                    <p>
                      <a
                        href="https://wa.me/919798827707"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <button className="btn btn-info">Ask Your Query</button>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </>
      )}
    </>
  );
}
