import React, { useState, useEffect } from "react";
import {  db } from "./Firebase";
import "./sellproduct.css";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function Sellproduct() {
  const { id } = useParams();
  const [image, setImage] = useState([]);
  const [productDesc, setproductDesc] = useState();
  const [productname, setproductname] = useState();
  const [phone, setPhone] = useState();

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "SellOrders"), where("Price", "==", id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setImage(doc.data().Product_img);
        setPhone(doc.data().phone);
        setproductname(doc.data().Name);
        setproductDesc(doc.data().Product_desc);
      });
    }
    fetchData();
  }, [id]);

  return (
    <div className="container my-3">
      <div className="singleimg">
        {image.map((item) => {
          return <img style={{ width: "25rem", height: "30rem" }} src={item} alt="img" />;
        })}
      </div>
      <div className="desc">
        <h4>{productname}</h4>
        {productDesc}
        
      </div>
      <div className="contactseller">
          <a href={`https://wa.me/${phone}`} rel="noreferrer" target="_blank"><span className="btn btn-info p-3 m-2 fs-5">&nbsp; Chat With Seller </span></a>
        </div>
    </div>
  );
}

export default Sellproduct;
