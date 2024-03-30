import React from 'react'
import './stationary.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min';
import Cycle from './CycleApi'
import { useState, useEffect } from 'react'
import Footer from './Footer'
import { FaRupeeSign } from 'react-icons/fa'
import { auth, db } from './Firebase'
import { collection, addDoc, query, where, doc, getDocs, updateDoc } from "firebase/firestore";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function Stationary() {
  // const navigate = useNavigate()
  const [userDataName, setuserDataName] = useState()
  const [userDataPhone, setuserDataPhone] = useState()
  const [userDataEmail, setuserDataEmail] = useState()
  const [selectedValue, setSelectedValue] = useState();
  const [cycleName, setcycleName] = useState('');
  const [today, setDate] = useState(new Date());
  const [cyclePrice, setcyclePrice] = useState('');
  const [currentUser, setcurrentUser] = useState("")
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (price, product_name) => {
    setShow(true);
    setcycleName(product_name)
    setcyclePrice(price)
  }

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const locale = 'en';
  useEffect(() => {
    const timer = setInterval(() => { // Creates an interval which will update the current data every minute
      // This will trigger a rerender every component that uses the useDate hook.
      setDate(new Date());
    }, 60 * 1000);
    return () => {
      clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
    }
  }, []);

  const day = today.toLocaleDateString(locale, { weekday: 'long' });
  const date = `${day}, ${today.getDate()} ${today.toLocaleDateString(locale, { month: 'long' })}\n\n`;
  // const hour = today.getHours();
  const time = today.toLocaleTimeString(locale, { hour: 'numeric', hour12: true, minute: 'numeric' });

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setcurrentUser(user.email)
      }
    })
  }, [])

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "users"), where("currentuseremail", "==", currentUser));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setuserDataName(doc.data().currentusername)
        setuserDataPhone(doc.data().currentuserphone)
        setuserDataEmail(doc.data().currentuseremail)
      });
    }
    fetchData()
  }, [currentUser])

  const cashPaymentCycle = async () => {
    
    console.log(cyclePrice, cycleName)
    console.log(userDataName)
    if (!userDataName || !userDataEmail || !userDataPhone) {
      alert("your cycle data is not stored yet!")
    } else {
      try {
        addDoc(collection(db, "CycleOrders"), { userDataName, userDataEmail, userDataPhone, Cycleprice: cyclePrice, Cyclename: cycleName, Date: date, Time: time });
        alert(`Hi ${userDataName}, Your Order Placed successfully!`);
        handleClose()
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }

  }

  const loadscript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src;
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  async function displayRazorpay(docId) {
    const res = await loadscript('https://checkout.razorpay.com/v1/checkout.js')
    if (!res) {
      alert("you are offline")
      return
    }
    const options = {
      "key": "rzp_live_njkK5E6B4apxte",
      "amount": cyclePrice * 100,
      "currency": "INR",
      "name": "MintraGo",
      "description": "Motive To Solve Students College Problems",
      "image": "http://localhost:3000/../images/mintragologo.png",
      "theme-color": "#528FF0",
      "handler": function (response) {
        console.log(docId)
        const washingtonRef = doc(db, "CycleOrdersOnline", docId);
        updateDoc(washingtonRef, {
          payment_id: response.razorpay_payment_id
        }).then(() => {
          alert("Payment successfull! your order has been placed")
          handleClose()
        })
      }
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

  }


  const onlinePaymentCycle = async () => {
    if (!userDataName || !userDataEmail || !userDataPhone) {
      alert("plese logedin!")
    }
    else {
      try {
        await addDoc(collection(db, "CycleOrdersOnline"), { userDataName, userDataPhone, userDataEmail, Cyclename: cycleName, Cycleprice: cyclePrice, payment_id: "paymentId", Date: date, Time: time  }).then(function (docRef) {
          displayRazorpay(docRef.id)
        })
      } catch (e) {
        alert("Something went woring please try agin!")
      }

    }

  }

  const orderplaced = () => {
    if (currentUser !== "") {
      if (!selectedValue) {
        alert("please select payment method!")
        return;
      }
      if (selectedValue === "cash") {
        cashPaymentCycle()
        setSelectedValue()
      } else if (selectedValue === "online") {
        onlinePaymentCycle()
        setSelectedValue()
      }
    } else {
      alert("please log in before placing order!")
      handleClose()
    }

  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className='container py-3 stationaryservices my-3'>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Choose Payment Method</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='readioinputs'>
              <p><input type="radio" className='radioInput' name='paymenttype' value="cash" onChange={handleChange} /><span>Cash On Delivery</span></p>
              <p><input type="radio" className='radioInput' name='paymenttype' value="online" onChange={handleChange} /><span>Pay Online</span></p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className='mintragoBtn' onClick={orderplaced}>
              Place Order
            </Button>
          </Modal.Footer>
        </Modal>
        <div className='stationarycontent py-3'>
          {
            Cycle.map((currentelm) => {
              const { id, keyId, image, title, desc, price, product_name, mrp, image1, image2, image3, image4 } = currentelm;
              return (
                <div className="card mx-2 my-3" style={{ width: '18rem' }} key={id}>
                  <div id={keyId} className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                      <div className="carousel-item active">
                        <img src={image} className="card-img-top" alt="mintrago" />
                      </div>
                      <div className="carousel-item">
                        <img src={image1} className="card-img-top" alt="mintrago1" />
                      </div>
                      <div className="carousel-item">
                        <img src={image2} className="card-img-top" alt="mintrago2" />
                      </div>
                      <div className="carousel-item">
                        <img src={image3} className="card-img-top" alt="mintrago2" />
                      </div>
                      <div className="carousel-item">
                        <img src={image4} className="card-img-top" alt="mintrago2" />
                      </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target={"#" + keyId} data-bs-slide="prev">
                      <span className="carousel-control-prev-icon bg-dark" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next " type="button" data-bs-target={"#" + keyId} data-bs-slide="next">
                      <span className="carousel-control-next-icon bg-dark" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <h5 className="card-title">MintraGo Price: <span><FaRupeeSign /> {price} </span></h5>
                    <p className="card-title">Market Price: <span><strike><FaRupeeSign /> {mrp}</strike> </span></p>
                    <p className="card-text">{desc}</p>
                    <Button className='mintragoBtn' onClick={(e) => handleShow(price, product_name)}>
                      Buy Now
                    </Button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className='mt-5'>
        <Footer />
      </div>
    </>
  )
}