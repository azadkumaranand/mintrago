import React, { useState, useEffect } from "react";
import Inputcontrol from "./Inputcontrol";
import "./sales.css";
import "./inputcontrol.css";
import { Button } from "react-bootstrap";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "./Firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'

function Sales() {
  const [currentUser, setcurrentUser] = useState("");
  // const storage = getStorage();
  const navigate = useNavigate()
  const [imageUrl, setImageUrl] = useState(0)
  const [loader, setLoader] = useState(false)
  const [dressUserData, setdressUserData] = useState({
    Name: "",
    email: "",
    phone: "",
  });
  const [values, setValues] = useState({
    product_name: "",
    price: "",
    product_desc: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [alertmessage, setalertmessage] = useState(false);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setcurrentUser(user.email);
      }
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      const q = query(
        collection(db, "users"),
        where("currentuseremail", "==", currentUser)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setdressUserData({
          Name: doc.data().currentusername,
          phone: doc.data().currentuserphone,
          email: doc.data().currentuseremail,
        });
      });
    }
    fetchData();
  }, [currentUser]);
  const [filechange, setfilechange] = useState()


  const addSellData = () => {
    if (!dressUserData.Name || !dressUserData.email || !dressUserData.phone) {
      setalertmessage("you are not loggedIn!");
      setShow2(true);
      return;
    }
    if(!imageUrl){
      setLoader(true)
    }
    if (!loader) {
      try {
        addDoc(collection(db, "SellOrders"), {
          ...dressUserData,
          Product_name: values.product_name,
          Price: values.price,
          Product_img: imageUrl,
          Product_desc: values.product_desc,
        });
        alert("your product has been listed")
        navigate("/sellproduct")
        setalertmessage(
          `Hi ${dressUserData.Name}, Your Product has been Listed successfully!`
        );
        setShow2(true);
        handleClose2();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    
  }

  const getUrlOfImage = () => {
    const urls = [];
    for (let i = 0; i < selectedFile.length; i++) {
      const storageRef = ref(storage, '../images/' + selectedFile[i].name);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile[i]);

      uploadTask.on('state_changed', 
        (snapshot) => {
          // Handle progressse
        },
        (error) => {
          // Handle errors
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            urls.push(url);
            if(urls.length === selectedFile.length){
              setImageUrl(urls)
            }
          });
        }
      );
    }
    
  }
  // useEffect(()=>{
  //   addSellData()
  // },[addSellData, imageUrl])
  if(filechange){
    getUrlOfImage()
    setfilechange(false)
  }


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files);
    setfilechange(true)
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
          <p className="loginhead">Sell your product</p>
          <div className="inputfield">
            <Inputcontrol
              label="Product Name"
              placeholder="Enter your product name"
              type="text"
              onChange={(e) =>
                setValues((prev) => ({ ...prev, product_name: e.target.value }))
              }
            />
          </div>
          <div className="inputfield">
            <Inputcontrol
              label="Product Price"
              placeholder="Product price"
              type="text"
              onChange={(e) =>
                setValues((prev) => ({ ...prev, price: e.target.value }))
              }
            />
          </div>
          <div className="inputfield">
            <Inputcontrol
              label="Product Images (4 Images)"
              placeholder="Upload Four image of your product"
              type="file"
              onChange={handleFileChange}
              multiple
            />
          </div>
          <div className="inputfield">
            <label className="textarealabel" htmlFor="textareafield">
              Product Descripton
            </label>
            <textarea
              className="textareafield"
              id="textareafield"
              label="Product Descripton"
              placeholder="How old your product is, how is it condition, any damage and stain,"
              type="text"
              onChange={(e) =>
                setValues((prev) => ({ ...prev, product_desc: e.target.value }))
              }
            ></textarea>
            <div className="footerlog">
              <Button className="mintragoBtn my-2" onClick={addSellData}>
                Sell Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sales;
