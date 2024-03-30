import React, { useState, useRef, useEffect } from "react";
import {
  FaFacebookSquare,
  FaWindowClose,
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
  FaTwitter,
  FaHome,
  FaInstagramSquare,
  FaWhatsappSquare,
  FaBars,
  FaPhoneSquareAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./navbar.css";
import { getAuth, signOut } from "firebase/auth";
import Offcanvas from "react-bootstrap/Offcanvas";
import { db } from "./Firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { setListedDressData } from "../store/ListedDressData";
import { setDressOrderData } from "../store/DressOrderData";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Loader from "./Loader";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useSelector } from "react-redux";

export default function Navbar({ name, showLoginBtn, setshowLoginBtn }) {
  const [IsMobile, SetIsMobile] = useState(true);
  const [socialState, setsocialState] = useState();
  const [hidenav, setHidenav] = useState(true);
  const [toggleArrow, settoggleArrow] = useState(true);
  const Menuref = useRef("");
  
  //usestate for listed dress
  const [loader, setLoader] = useState(false);
  const [listedDress, setListedDress] = useState();
  const [orderedDress, setOrderedDress] = useState([]);
  const userData = useSelector((state) => {
    return state.activeUser;
  });
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //fetch listed dress data ;
  useEffect(() => {
    async function fetchData() {
      setLoader(true);
      try {
        const listOfDress = [];
        const querySnapshot = await getDocs(collection(db, "ListedDress"));
        querySnapshot.docs.forEach((doc) => {
          listOfDress.push({ ...doc.data(), id: doc.id });
        });
        setListedDress(listOfDress);
        dispatch(setListedDressData(listOfDress));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoader(false);
      }
    }

    fetchData();
  }, [dispatch]);

  //fetch ordered dress data
  useEffect(() => {
    async function fetchData() {
      setLoader(true);
      try {
        const dressOrders = [];
        const querySnapshot = await getDocs(collection(db, "DressOrders"));
        querySnapshot.docs.forEach((doc) => {
          dressOrders.push({ ...doc.data(), id: doc.id });
        });
        setOrderedDress(dressOrders);
        dispatch(setDressOrderData(dressOrders));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoader(false);
      }
    }

    fetchData();
  }, [dispatch]);

  const [cancelId, setcancelId] = useState();
  const [cancelListingId, setCancelListingId] = useState();
  const [renterId, setRenterId] = useState();
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const [show4, setShow4] = useState(false);
  const handleClose4 = () => setShow4(false);

  const myStyle = {
    top: socialState,
  };
  const logoutUser = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        alert("Log Out Successfully!");
        setshowLoginBtn(false);
        window.location.reload();
      })
      .catch((error) => {
        alert("Something went wrong!");
      });
  };
  const toggleSocial = () => {
    if (socialState === 1000) {
      setsocialState("");
      settoggleArrow(true);
    } else {
      setsocialState(1000);
      settoggleArrow(false);
    }
  };
  const shownavlinks = () => {
    if (IsMobile) {
      SetIsMobile(false);
      setHidenav(false);
    } else {
      SetIsMobile(true);
      setHidenav(true);
    }
  };
  const hidelikafterclick = () => {
    Menuref.current.classList.remove("mobile_links");
    Menuref.current.classList.add("nav_links");
    SetIsMobile(true);
    setHidenav(true);
  };

  const cancleOrders = (id, renterId) => {
    setcancelId(id);
    setRenterId(renterId);
    setShow2(true);
  };
  
  const confcancleOrder = async () => {
    const updaterRenterSatus = doc(db, "ListedDress", renterId);
    // console.log(renterId)
    setLoader(true);
    await updateDoc(updaterRenterSatus, {
      rendted: false,
    });
    const washionRef = doc(db, "DressOrders", cancelId);

    await updateDoc(washionRef, {
      OrderStatus: "cancelOrder",
    });
    setLoader(false);
    alert("Your Order has been cancled!");
    handleClose2();
    window.location.reload();
  };
  const cancelconflisting = (id) => {
    setCancelListingId(id);
    setShow3(true);
  };
  const confcancleListing = async () => {
    const washionRef = doc(db, "ListedDress", cancelListingId);
    setLoader(true);
    await updateDoc(washionRef, {
      listingStatus: "cancelListing",
    });
    setLoader(false);
    alert("Your Listing has been cancled!");
    handleClose2();
    window.location.reload();
  };
  const listAgainRequest = async (id) => {
    const washionRef = doc(db, "ListedDress", id);
    setLoader(true);
    await updateDoc(washionRef, {
      listingStatus: "status",
    });
    setLoader(false);
    alert("Your dress listed again successfully!");
    handleClose2();
    window.location.reload();
  };
  const onDressRecived = async (id, userid) => {
    const washionRef1 = doc(db, "DressOrders", userid);
    setLoader(true);
    await updateDoc(washionRef1, {
      OrderStatus: "cancelOrder",
    });
    const washionRef = doc(db, "ListedDress", id);
    await updateDoc(washionRef, {
      listingStatus: "status",
      rendted: false,
    });
    setLoader(false);
    setShow4(true);
    // alert("Your dress listed again successfully!");
    // handleClose2();
    window.location.reload();
  };
  // console.log("hello", userData.email)
  return (
    <>
      {loader && <Loader />}
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Hey {name} Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>You want to cancle your order</Modal.Body>
        <Modal.Footer>
          <Button className="mintragoBtn" onClick={confcancleOrder}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show3} onHide={handleClose3}>
        <Modal.Header closeButton>
          <Modal.Title>Hey {name} Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>You want to cancle your order</Modal.Body>
        <Modal.Footer>
          <Button className="mintragoBtn" onClick={confcancleListing}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show4} onHide={handleClose4}>
        <Modal.Header closeButton>
          <Modal.Title>Hey {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your dress is ready for next day rent <br />
          Thank you &hearts;
        </Modal.Body>
        <Modal.Footer>
          <Button className="mintragoBtn" onClick={handleClose4}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="main_nav">
        <div className="navbar">
          <div className="logo">
            <img src="../images/mintragologo.png" alt="logo" />
            <span>
              Mintra<span>Go</span>
            </span>
          </div>
          <div className="menubar" id="menu">
            <button
              className="btn btn-info btnav"
              onClick={() => shownavlinks()}
            >
              {hidenav ? <FaBars /> : <FaWindowClose />}
            </button>
          </div>
          <div
            ref={Menuref}
            className={IsMobile ? "nav_links" : "mobile_links"}
          >
            {/* <img id="cancelnav" src="../images/xamarks.png" alt="xmarks" /> */}
            <ul>
              <li>
                <Link to="/" onClick={() => hidelikafterclick()}>
                  <FaHome /> HOME
                </Link>
              </li>
              <li>
                <Link to="/dressforrent" onClick={() => hidelikafterclick()}>
                  DRESS
                </Link>
              </li>
              <li>
                <Link to="/cycle" onClick={() => hidelikafterclick()}>
                  CYCLE
                </Link>
              </li>
              <li>
                <Link to="/listdress" onClick={() => hidelikafterclick()}>
                  Renter
                </Link>
              </li>
              {/* <li><Link to="/sellproduct" onClick={() => hidelikafterclick()}>Buy/Sell</Link></li> */}
              <div className="btns">
                {showLoginBtn && (
                  <>
                    <div className="mintragoBtn">
                      <Link to="/login">LogIn</Link>
                    </div>
                    <div className="mintragoBtn">
                      <Link to="/signup">SignUp</Link>
                    </div>
                  </>
                )}
                {name && (
                  <div className="btns">
                    <div className="mintragoBtn" onClick={handleShow}>
                      My Account
                    </div>
                  </div>
                )}
              </div>
            </ul>
          </div>
        </div>
      </div>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            Hi {name}
            <span className="mintragoBtn" onClick={logoutUser}>
              LogOut
            </span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Tabs variant="enclosed">
            <TabList>
              <Tab
                style={{ border: "1px solid black", padding: "10px" }}
                className="rounded-2 mx-2"
              >
                Order
              </Tab>
              <Tab
                style={{ border: "1px solid black", padding: "10px" }}
                className="rounded-2 mx-2"
              >
                Listed
              </Tab>
            </TabList>
            <TabPanels className="px-2 my-2">
              <TabPanel>
                {orderedDress
                  ? orderedDress
                      .filter((item) => item.email === userData.email)
                      .map((item, index) => {
                        return item.OrderStatus !== "cancelOrder" ? (
                          <div key={item.id}>
                            {index + 1}.
                            <p>
                              Dress:{" "}
                              {item.dressName === "MechDress"
                                ? "Mechanical Lab Dress"
                                : "Lab Coat"}
                            </p>
                            <p>Hostel : {item.hostel}</p>
                            {(item.hostel.toLowerCase().trim() === "mintrago") && 
                              <p>Your dress will be dilever tomorrow before {" "}
                              <strong className="text-warning">
                                8:00 AM
                              </strong></p>
                            }
                            {(item.hostel.toLowerCase().trim() !== "mintrago") && 
                              <p>Your have to collet your dress from{" "}
                              <strong className="text-warning">
                                {item.hostel}
                              </strong></p>
                            }
                            <p>Dress Size: {item.dress_size}</p>
                            <span style={{ fontSize: "35px" }}>
                              <a
                                href={`tel:${item.renterPhone}`}
                                target="_blank"
                                rel="noreferrer noopener"
                                style={{ fontSize: "35px", color: "#3ce86a" }}
                              >
                                <FaPhoneSquareAlt />
                              </a>
                            </span>
                            <span
                              style={{ fontSize: "35px", marginLeft: "20px" }}
                            >
                              <a
                                href={`https://wa.me/${item.renterPhone}`}
                                target="_blank"
                                rel="noreferrer noopener"
                                style={{ fontSize: "35px", color: "#3ce86a" }}
                              >
                                <FaWhatsappSquare />
                              </a>
                            </span>
                            <br />
                            <button
                              className="cancleorder p-2 rounded-2 border-0 text-white"
                              style={{
                                backgroundColor: "#FF66C4",
                                marginTop: "10px",
                              }}
                              onClick={() =>
                                cancleOrders(item.id, item.renterId)
                              }
                            >
                              Cancel Order
                            </button>
                          </div>
                        ): ""
                      })
                  : "You didn't order"}
              </TabPanel>
              <TabPanel>
                {listedDress
                  ? listedDress
                      .filter((item) => item.email === userData.email)
                      .map((item, index) => {
                        return (
                          <>
                            <div key={item.id}>
                              {index + 1}.
                              <p>
                                Dress:{" "}
                                {item.dress_name === "MechDress"
                                  ? "Mechanical Lab Dress"
                                  : "Lab Coat"}
                              </p>
                              <p>Dress Size: {item.dressSize}</p>
                              {item.rendted && (
                                <button
                                  className="cancleorder p-2 rounded-2 border-0 text-white"
                                  style={{
                                    backgroundColor: "#318181",
                                    margin: "10px 0",
                                  }}
                                  onClick={() =>
                                    onDressRecived(item.id, item.userOrderId)
                                  }
                                >
                                  Dress Recived
                                </button>
                              )}
                              <br />
                              {item.listingStatus !== "cancelListing" ? (
                                <button
                                  className="cancleorder p-2 rounded-2 border-0 text-white"
                                  style={{
                                    backgroundColor: "#FF66C4",
                                    margin: "10px 0",
                                  }}
                                  onClick={() => cancelconflisting(item.id)}
                                >
                                  Cancel Listing
                                </button>
                              ) : (
                                <button
                                  className="text-light bg-success border-0 h6 rounded-2 p-3"
                                  onClick={() => listAgainRequest(item.id)}
                                >
                                  List Again
                                </button>
                              )}
                            </div>
                          </>
                        );
                      })
                  : "You didn't list"}
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Body>
      </Offcanvas>
      <div className="social_toggle">
        <p onClick={() => toggleSocial()}>
          {toggleArrow ? <FaArrowAltCircleDown /> : <FaArrowAltCircleUp />}
        </p>
      </div>
      <div className="social_media" style={myStyle}>
        <p>
          <a
            href="https://instagram.com/mintrago2022"
            target="_blank"
            rel="noreferrer noopener"
          >
            <FaInstagramSquare />
          </a>
        </p>

        <p>
          <a
            href="https://twitter.com/mintrago3"
            target="_blank"
            rel="noreferrer noopener"
          >
            <FaTwitter />
          </a>
        </p>
        <p>
          <a
            href="https://wa.me/919798827707"
            target="_blank"
            rel="noreferrer noopener"
          >
            <FaWhatsappSquare />
          </a>
        </p>
        <p>
          <a
            href="https://www.facebook.com/profile.php?id=100087409022493"
            target="_blank"
            rel="noreferrer noopener"
          >
            <FaFacebookSquare />
          </a>
        </p>
      </div>
    </>
  );
}
