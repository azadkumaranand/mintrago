import React, { useState, useEffect } from "react";
import { auth, db } from "./Firebase";
import { collection, getDocs } from "firebase/firestore";
import './sellproduct.css'
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import Loader from './Loader'

function Sellproduct() {
  const [loader, setLoader] = useState(false)
  const [currentUser, setcurrentUser] = useState("");
  const [sellproduct, setSellProduct] = useState();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setcurrentUser(user.email);
      }
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoader(true)
      const sellproduct = [];
      const querySnapshot = await getDocs(collection(db, "SellOrders"));
      querySnapshot.docs.forEach(async (doc) => {
        sellproduct.push({ ...doc.data(), id: doc.id });
      });
      setSellProduct(sellproduct);
      if(sellproduct){
        setLoader(false)
      }
      
    }
    fetchData();
  }, [currentUser]);

  return (
    <>
    <div className="container sellproductcontainer">
      <div className="sellbtn">
        <Link to="/selling">Sell</Link>
      </div>
     {loader && <Loader/>} 
    {sellproduct
        ? sellproduct.map((item, index) => {
            const imgpd = item.Product_img[0]
            return (
              <Card style={{ width: "12rem", height: "auto" }} key={item.id} className="mx-4 my-3">
                <Card.Img variant="top" src={imgpd} style={{ height: "10rem" }} />
                <Card.Body>
                  <Card.Title>{item.Product_name}</Card.Title>
                  <Card.Text>Price: {item.Price}</Card.Text>
                  <Link to={`/singleproduct/${item.Price}`}><Button variant="info">See Details</Button></Link>
                </Card.Body>
              </Card>
            );
          })
        : <Loader/>}
    </div>
      
    </>
  );
}

export default Sellproduct;
