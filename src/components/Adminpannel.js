import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaPhoneSquareAlt, FaEnvelope } from "react-icons/fa";
import "./admin.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsFillCalendar2DateFill } from "react-icons/bs";

function Adminpannel() {
  const ListedDress = useSelector((state) => {
    return state.listedDressData;
  });
  const DressOrderData = useSelector((state) => {
    return state.dressOrderData;
  });
  const userData = useSelector((state) => {
    return state.activeUser;
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const [selectGender, setsSlectGender] = useState();
  const [selectGender1, setsSlectGender1] = useState();

  const [DressOrderList, setDressOrderList] = useState(true);
  const [ListedDressList, setListedDressList] = useState(false);
  const [cycleOrderList, setcycleOrderList] = useState(false);
  const azad = userData.email === "azadanand9798@gmail.com";
  const isAdmin1 = azad && ListedDressList;
  const isAdmin2 = azad && DressOrderList;
  const isAdmin3 = azad && cycleOrderList;
  const ListedDressFiltterByGender =
    Array.isArray(ListedDress) && ListedDress.length > 0
      ? ListedDress.filter((item) => {
          const filteredDress = item.gender === selectGender;
          if (selectGender !== "") {
            return filteredDress;
          }
          return true;
        })
      : [];
    

  const DressFilterByDate =
    Array.isArray(DressOrderData) && DressOrderData.length > 0
      ? DressOrderData.filter((item) => {
          
          const isNotCancelled = item.OrderStatus !== "cancelOrder";
          // const filteredDress = item.gender === selectGender1;
          // if (filteredDress) {
          //   return filteredDress;
          // }
          if(selectedDate){
            const filtterByDate = selectedDate.toLocaleDateString() === item.orderDate;
              return filtterByDate;
          }
          // return true;
          // if (selectedDate) {
          //   const filtterByDate = selectedDate.toLocaleDateString() === item.orderDate;
          //   return filtterByDate;
          // }
          return isNotCancelled;
          
        })
      : [];
  return (
    <>
      <div className="container-fluid" style={{ marginTop: "75px" }}>
        <div className="row">
          <div className="col-lg-2" style={{ backgroundColor: "#00ffd5" }}>
            <div className="adminbar">
              <ul>
                <li
                  onClick={() => {
                    setDressOrderList(true);
                    setListedDressList(false);
                    setcycleOrderList(false);
                  }}
                >
                  Dress Orders
                </li>
                <li
                  onClick={() => {
                    setDressOrderList(false);
                    setListedDressList(true);
                    setcycleOrderList(false);
                  }}
                >
                  Listed Dress
                </li>
                <li
                  onClick={() => {
                    setDressOrderList(false);
                    setListedDressList(false);
                    setcycleOrderList(true);
                  }}
                >
                  Cycle Orders
                </li>
              </ul>
            </div>
          </div>

          <div
            className="col-lg-10"
            style={{ height: "calc(100vh - 75px)", overflow: "scroll" }}
          >
            {isAdmin1 && (
              <>
                <p className="headline1">Listed Dress</p>
                {/* <div>
                  <h2 className="text-dark">Filter By Date</h2>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="MMMM d, yyyy"
                    className="custom-datepicker"
                    customInput={
                      <BsFillCalendar2DateFill
                        style={{
                          fontSize: "45px",
                          cursor: "pointer",
                          color: "#fc0384",
                          marginRight: "10px",
                        }}
                      />
                    }
                  />
                  {selectedDate && (
                    <span
                      style={{
                        fontSize: "18px",
                        color: "#fc0384",
                        fontWeight: "500",
                      }}
                    >
                      {selectedDate.toLocaleDateString()}
                    </span>
                  )}
                </div> */}
                <div>
                  <h1>Filter by Gender</h1>
                  <div>
                    <button
                      onClick={() => {
                        setsSlectGender("male");
                      }}
                      className="btn btn-info px-3 py-2 text-white m-3"
                      style={{fontWeight: "700"}}
                    >
                      Male Lister
                    </button>
                    <button
                      onClick={() => {
                        setsSlectGender("female");
                      }}
                      className="btn btn-info px-3 py-2 text-white m-3"
                      style={{fontWeight: "700"}}
                    >
                      Female Lister
                    </button>
                  </div>
                </div>
                <table className="table">
                  <thead>
                    <tr style={{ border: "1px solid black" }}>
                      <th style={{ border: "1px solid black" }} scope="col">
                        S.No
                      </th>
                      <th style={{ border: "1px solid black" }} scope="col">
                        Renter
                      </th>
                      <th style={{ border: "1px solid black" }} scope="col">
                        Dress
                      </th>
                      <th style={{ border: "1px solid black" }} scope="col">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ border: "1px solid black" }}>
                    {Array.isArray(ListedDressFiltterByGender) &&
                    ListedDressFiltterByGender.length > 0
                      ? ListedDressFiltterByGender.map((user, index) => {
                          return (
                            <tr
                              key={user.id}
                              style={{ border: "1px solid black" }}
                            >
                              <th scope="row">{index + 1}</th>
                              <td style={{ border: "1px solid black" }}>
                                <div>{user.Name}</div>
                                <div>Hostel: {user.hostel}</div>
                                <div>
                                  <span>
                                    <a
                                      className="icons"
                                      href={`tel:${user.phone}`}
                                      target="_blank"
                                      rel="noreferrer noopener"
                                    >
                                      <FaPhoneSquareAlt />
                                    </a>
                                  </span>{" "}
                                  &nbsp;&nbsp;&nbsp;&nbsp;
                                  <span>
                                    <a
                                      className="icons"
                                      href={`mailto:${user.email}`}
                                      target="_blank"
                                      rel="noreferrer noopener"
                                    >
                                      <FaEnvelope />
                                    </a>
                                  </span>
                                </div>
                              </td>
                              <td style={{ border: "1px solid black" }}>
                                <div>{user.dress_name}</div>
                                <div>{user.dressSize}</div>
                              </td>
                              {/* <td style={{ border: "1px solid black" }}></td> */}
                              <th>{user.listingStatus}</th>
                            </tr>
                          );
                        })
                      : ""}
                  </tbody>
                </table>
              </>
            )}
            {isAdmin2 && (
              <>
                <p className="headline1">Dress Orders</p>
                <div>
                  <h2 className="text-dark">Filter By Date</h2>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="MMMM d, yyyy"
                    className="custom-datepicker"
                    customInput={
                      <BsFillCalendar2DateFill
                        style={{
                          fontSize: "45px",
                          cursor: "pointer",
                          color: "#fc0384",
                          marginRight: "10px",
                        }}
                      />
                    }
                  />
                  {selectedDate && (
                    <span
                      style={{
                        fontSize: "18px",
                        color: "#fc0384",
                        fontWeight: "500",
                      }}
                    >
                      {selectedDate.toLocaleDateString()}
                    </span>
                  )}
                </div>
                {/* <div>
                  <h1>Filter by Gender</h1>
                  <div>
                    <button
                      onClick={() => {
                        setsSlectGender1("male");
                      }}
                      className="btn btn-info px-3 py-2 text-white m-3"
                      style={{fontWeight: "700"}}
                    >
                      Male Lister
                    </button>
                    <button
                      onClick={() => {
                        setsSlectGender1("female");
                      }}
                      className="btn btn-info px-3 py-2 text-white m-3"
                      style={{fontWeight: "700"}}
                    >
                      Female Lister
                    </button>
                  </div>
                </div> */}
                <table className="table">
                  <thead>
                    <tr style={{ border: "1px solid black" }}>
                      <th style={{ border: "1px solid black" }} scope="col">
                        S.No
                      </th>
                      <th style={{ border: "1px solid black" }} scope="col">
                        Order By
                      </th>
                      <th style={{ border: "1px solid black" }} scope="col">
                        Dress
                      </th>
                      <th style={{ border: "1px solid black" }} scope="col">
                        Listed By
                      </th>
                      <th style={{ border: "1px solid black" }} scope="col">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ border: "1px solid black" }}>
                    {DressFilterByDate.map((user, index) => {
                      return (
                        <tr key={user.id} style={{ border: "1px solid black" }}>
                          <th scope="row">{index + 1}</th>
                          <td style={{ border: "1px solid black" }}>
                            <div>{user.Name}</div>
                            <div>{user.orderDate}</div>
                            <div>
                              <span>
                                <a
                                  className="icons"
                                  href={`tel:${user.phone}`}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                >
                                  <FaPhoneSquareAlt />
                                </a>
                              </span>{" "}
                              &nbsp;&nbsp;&nbsp;&nbsp;
                              <span>
                                <a
                                  className="icons"
                                  href={`mailto:${user.email}`}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                >
                                  <FaEnvelope />
                                </a>
                              </span>
                            </div>
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            <div>{user.dressName}</div>
                            <div>{user.dress_size} {user.gender}</div>
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            <div>{user.rendterName}</div>
                            <div>Hosel: {user.hostel}</div>
                            <div>Room: {user.renterRoom}</div>
                            <div>
                              <span>
                                <a
                                  className="icons"
                                  href={`tel:${user.renterPhone}`}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                >
                                  <FaPhoneSquareAlt />
                                </a>
                              </span>
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <span>
                                <a
                                  className="icons"
                                  href={`mailto:${user.renterEmail}`}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                >
                                  <FaEnvelope />
                                </a>
                              </span>
                            </div>
                          </td>
                          <th>{user.OrderStatus}</th>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
            {isAdmin3 && (
              <div>
                <h1>Comming Soon....</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Adminpannel;
