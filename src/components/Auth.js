import {useState, useEffect} from 'react';
import { auth, db } from "./Firebase";
import {
    collection,
    query,
    where,
    getDocs,
  } from "firebase/firestore";

export function CurrentUserFun() {
    const [currentUser, setcurrentUser] = useState("");
    
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            setcurrentUser(user.email);
          }
        });
      }, []);

  return currentUser;
}



export async function UserDetailsFun(){
    const [currentUser, setcurrentUser] = useState("");
    auth.onAuthStateChanged((user) => {
        if (user) {
          setcurrentUser(user.email);
        }
      });
    const [UserData, setUserData] = useState({
        Name: "",
        email: "",
        phone: "",
    })
    useEffect(() => {
        async function fetchData() {
            await currentUser
          const q = query(
            collection(db, "users"),
            where("currentuseremail", "==", currentUser)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            setUserData({
              Name: doc.data().currentusername,
              phone: doc.data().currentuserphone,
              email: doc.data().currentuseremail,
            });
          });
        }
        fetchData();
      }, [currentUser]);
      return UserData
}


