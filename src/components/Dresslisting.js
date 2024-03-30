import React, { useState } from "react";
import Inputcontrol from "./Inputcontrol";
import "./sales.css";
import "./inputcontrol.css";
import { Button } from "react-bootstrap";
import { db } from "./Firebase";
import { collection, addDoc } from "firebase/firestore";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useSelector } from "react-redux";


function Dresslisting() {
  const userData = useSelector((state) => {return state.activeUser});
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [dressType, setDressType] = useState("");
  const [values, setValues] = useState({
    dressSize: "",
    hostel: "",
    roomNo: ""
  });
  const [tcAccepted, setTcAccepted] = useState(false);
  const [acceptMGPrice, setacceptMGPrice] = useState(false);
  const [errorMessage, seterrormessage] = useState("");
  const [alertmessage, setalertmessage] = useState(false);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  

  const addSellData = async () => {
    if (!userData.Name || !userData.email || !userData.phone) {
      setalertmessage("You are not loggedIn!");
      setShow2(true);
      return;
    }
    if(values.dressSize==="" || values.hostel==="" || values.roomNo===""){
      seterrormessage("Please fill all the credentials")
      return
    }else{
      seterrormessage("")
    }
    if(!tcAccepted || !acceptMGPrice){
      seterrormessage("Please accept terms and conditions")
      return
    }else{
      seterrormessage("")
    }
    try {
        setLoader(true)
        await addDoc(collection(db, "ListedDress"), {
          ...userData,
          dress_name: dressType,
          dressSize: values.dressSize,
          hostel: values.hostel,
          Room_No: values.roomNo,
          listingStatus: "status",
          rendted: false,
          userOrderId: ""
        });
        setLoader(false)
        alert("your product has been listed");
        navigate("/dressforrent");
        setalertmessage(
          `Hi ${userData.Name}, Your Product has been Listed successfully!`
        );
        setShow2(true);
        handleClose2();
        window.location.reload();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
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
      <div className="salescontainer">
        <div className="formbox">
          <p className="loginhead">List Your Dress</p>
          <div className="modalField inputfield">
            <label className="text-dark">Select dress type</label>
            <select
              value={dressType}
              onChange={(event) => setDressType(event.target.value)}
            >
              <option value="none">
                Select Your Dress Type
              </option>
              <option value="MechDress">Mechanical Dress</option>
              <option value="LabCoat">Lab Coat</option>
            </select>
          </div>
          <div className="inputfield">
            <Inputcontrol
              label="Dress Size"
              placeholder="Enter your dress size"
              type="number"
              onChange={(e) =>
                setValues((prev) => ({ ...prev, dressSize: e.target.value }))
              }
            />
          </div>
          <div className="inputfield">
            <Inputcontrol
              label="Hostel Name"
              placeholder="Enter your hostel name"
              type="text"
              onChange={(e) =>
                setValues((prev) => ({ ...prev, hostel: e.target.value }))
              }
            />
          </div>
          <div className="inputfield">
            <Inputcontrol
              label="Room No"
              placeholder="Enter you room no"
              type="text"
              onChange={(e)=>setValues((prev) => ({ ...prev, roomNo: e.target.value }))}
              multiple
            />
          </div>
          <div className="checkbox inputfield">
            <label>
              <input
                type="checkbox"
                checked={acceptMGPrice}
                onChange={(e) => {
                  setacceptMGPrice(e.target.checked);
                }}
              />
              <span style={{ color: "black" }}>
                Mechanical Dress : Rs. 18 & Lab Coat: Rs. 12 fro a lab
              </span>
            </label>
          </div>
          <div className="checkbox inputfield">
            <label>
              <input
                type="checkbox"
                checked={tcAccepted}
                onChange={(e) => {
                  setTcAccepted(e.target.checked);
                }}
              />
              <span style={{ color: "black" }}>
                Accept <a href="https://drive.google.com/file/d/1NsttNnJapNChbTfCvcNT4McBi-i65zIe/view" target="_blank" rel="noreferrer"> MintraGo Terms & Conditions</a> (recommended to read)
              </span>
            </label>
          </div>
          <div className="errormessage">
            {errorMessage ? errorMessage : ""}
          </div>
          <div className="inputfield">
            <div className="footerlog">
              <Button className="mintragoBtn my-2" onClick={addSellData}>
                List Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dresslisting;
