
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Cycle from './components/Cycle';
import Dress from './components/Dress';
import Sales from './components/Sales';
import Sellproduct from './components/Sellproduct'
import SingleProduct from './components/Singleproduct'
import Dresslisting from './components/Dresslisting'
import Query from './components/Query';
import Signup from './components/Signup'
import Login from './components/Login'
import Passwordreset from './components/Passwordreset'
import {auth} from './components/Firebase'
import { setUserDetails } from "./store/Auth";
import { setDateTime } from "./store/dateTime";
import { db } from "./components/Firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useDispatch } from "react-redux";
import Listeddress from './components/Listeddress'
import Adminpannel from './components/Adminpannel'

import {Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
function App() {
  const [name, setName]=useState()
  const [showLoginBtn, setshowLoginBtn]=useState(true)
  const [currentUser, setcurrentUser] = useState("");

  //date 
  const [today, setDate] = useState(new Date());
  const locale = "en";
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 60 * 1000);
    return () => {
      clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
    };
  }, []);
  const day = today.toLocaleDateString(locale, { weekday: "long" });
  const date = `${day}, ${today.getDate()} ${today.toLocaleDateString(locale, {
    month: "long",
  })}\n\n`;
  // const hour = today.getHours();
  const time = today.toLocaleTimeString(locale, {
    hour: "numeric",
    hour12: true,
    minute: "numeric",
  });



  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      if(user){
        const nameOfUser = user.displayName
        const shortname = nameOfUser.substring(0,8)
        setName(shortname)
        setshowLoginBtn(false)
        setcurrentUser(user.email)
      }else{setName()}
    })
  },[])
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setDateTime({
      date: date,
      time: time,
    }))
    async function fetchData() {
      const q = query(
        collection(db, "users"),
        where("currentuseremail", "==", currentUser)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        dispatch(setUserDetails({
          id: doc.id,
          Name: doc.data().currentusername,
          phone: doc.data().currentuserphone,
          email: doc.data().currentuseremail,
          gender: doc.data().gender
        }));
      });
    }
    fetchData()
    // if (currentUser) {
    //   dispatch(setUserEmail(currentUser));
    // }
  },[currentUser, dispatch, date, time])
  
  return (
    <>
      <Navbar name={name} setshowLoginBtn={setshowLoginBtn} showLoginBtn={showLoginBtn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dress" element={<Dress />} />
        <Route path="/cycle" element={<Cycle />} />
        <Route path="/selling" element={<Sales />} />
        <Route path="/sellproduct" element={<Sellproduct />} />
        <Route path="/listdress" element={<Dresslisting />} />
        <Route path="/admin" element={<Adminpannel />} />
        <Route path="/dressforrent" element={<Listeddress />} />
        <Route path="/query" element={<Query />} />
        <Route path="/query" element={<Query />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/query" element={<Query />} />
        <Route path="/passreset" element={<Passwordreset />} />
        <Route path="/singleproduct/:id" element={<SingleProduct />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
