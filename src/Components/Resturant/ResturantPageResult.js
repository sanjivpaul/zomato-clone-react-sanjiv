import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";

function ResturantPageResult() {
  let [tab, setTab] = useState(1);
  let { id } = useParams(); //params are used for making dynamic url
  let defaultValue = {
    aggregate_rating: 0,
    city: "",
    city_id: -1,
    contact_number: "0",
    cuisine: [],
    cuisine_id: [],
    image: "retaurent-background.png",
    locality: "",
    location_id: -1,
    mealtype_id: -1,
    min_price: 0,
    name: "",
    rating_text: "",
    thumb: [],
    _id: "-1",
  };
  let [restaurant, setResturant] = useState({ ...defaultValue });
  let [menuItems, setMenuItems] = useState([]);
  let [totalPrices, setTotalPrices] = useState(0);

  let getTokenDetails = () => {
    //read the data from localStorage
    let token = localStorage.getItem("auth-token");
    if (token === null) {
      return false;
    } else {
      return jwt_decode(token);
    }
  };

  let [userDetails, setUserDetails] = useState(getTokenDetails());

  let getResturantDetails = async () => {
    try {
      let URL = "http://localhost:5003/api/get-resturant-details-by-id/" + id;
      let { data } = await axios.get(URL);
      // console.log(data);
      if (data.status === true) {
        setResturant({ ...data.result });
      } else {
        setResturant({ ...defaultValue });
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Server Side Error?", "", "question");
    }
  };

  let getMenuItems = async () => {
    try {
      let URL =
        "http://localhost:5003/api/get-menu-item-list-by-resturant-id/" + id;
      let { data } = await axios.get(URL);
      if (data.status === true) {
        // console.log(data.result);
        setMenuItems([...data.result]);
      } else {
        setMenuItems([]);
      }
      setTotalPrices(0); //reset the state
    } catch (error) {
      console.log(error);
      Swal.fire("Server Side Error?", "", "question");
    }
  };

  //add qty
  let addItemQuantity = (index) => {
    let _menuItems = [...menuItems]; //reCreate menuItems
    _menuItems[index].qty += 1; //increament the menuItems qty

    let _price = Number(_menuItems[index].price);
    setTotalPrices(totalPrices + _price); //0+99=> 99+99=> 198 (updating totalprice state)
    setMenuItems(_menuItems); //updating the menuItems state
  };

  // remove qty
  let removeItemQuantity = (index) => {
    let _menuItems = [...menuItems]; //reCreate menuItems
    _menuItems[index].qty -= 1; //decreament the menuItems qty

    let _price = Number(_menuItems[index].price);
    setTotalPrices(totalPrices - _price); //198-99=> 99-99=> 0 (updating totalprice state)
    setMenuItems(_menuItems); //updating the menuItems state
  };

  //RazorPay Integration
  async function loadScript() {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      return true;
    };
    script.onerror = () => {
      return false;
    };
    window.document.body.appendChild(script);
  }

  let displayRazorpay = async () => {
    let isLoaded = await loadScript();
    if (isLoaded === false) {
      alert("SDK is not loaded");
      return false;
    }
    var serverData = {
      amount: totalPrices,
    };
    // else {
    //   alert("SDK is loaded");
    // }
    let { data } = await axios.post(
      "http://localhost:5003/api/payment/gen-order",
      serverData
    );
    var order = data.order;

    var options = {
      key: "rzp_test_crv4qLGhZL1RPh", // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: order.currency,
      name: "Zomato Clone payment",
      description: "Buying a product from zomato",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
      order_id: order.id, //order id is generated @ server side -- step 1
      handler: async function (response) {
        try {
          let URL = "http://localhost:5003/api/payment/verify";
          var sendData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };
          var { data } = await axios.post(URL, sendData);
          if (data.status === true) {
            Swal.fire({
              icon: "success",
              title: "Order Place Successfully",
              text: "",
            }).then(() => {
              // window.location.assign("/"); //refresh page automatically
              // window.location.reload("/");
              window.location.replace("/"); //go to home page(refresh)
            });
          } else {
            Swal.fire({
              icon: "success",
              title: "Payment Fail Try Again",
              text: "",
            });
          }
        } catch (error) {
          Swal.fire("Server Side Error?", "", "question");
        }
      },
      prefill: {
        name: userDetails.name, //pass name dynamically
        email: userDetails.email, //pass email dynamically
        contact: "9999999999",
      },
    };
    // console.log(window);
    var razorpayObject = window.Razorpay(options);
    razorpayObject.open();
  };

  useEffect(() => {
    getResturantDetails();
  }, []);

  return (
    <>
      {/* Modals start */}
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content p-5">
            <div className="d-flex justify-content-between ">
              <h5
                className="modal-title fw-bold mb-3"
                id="exampleModalToggleLabel"
              >
                {restaurant.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="">
              {/* item-1 */}
              {menuItems.map((menu_item, index) => {
                return (
                  <section
                    className="d-flex justify-content-between align-items-center border-bottom border-muted mb-3"
                    key={index}
                  >
                    <section>
                      <p className="m-0">
                        <i className="fa fa-heart" aria-hidden="true"></i>
                      </p>
                      <p className="m-0 fw-bold">{menu_item.name}</p>
                      <p className="m-0 fw-bold">@{menu_item.price}</p>
                      <p className="m-0 modal-text-dsc text-muted mb-3">
                        {menu_item.description}
                      </p>
                    </section>
                    <section>
                      <div className="menu-food-item">
                        <img src={"/images/" + menu_item.image} alt="" />
                        {menu_item.qty === 0 ? (
                          <button
                            className="btn btn-primary btn-sm add"
                            onClick={() => addItemQuantity(index)} //call runtime
                          >
                            Add
                          </button>
                        ) : (
                          <div className="order-item-count section ">
                            <span
                              className="hand btn fw-bold text-danger"
                              onClick={() => removeItemQuantity(index)} //decreament
                            >
                              -
                            </span>
                            <span>{menu_item.qty}</span>
                            <span
                              className="hand fw-bold  text-success"
                              onClick={() => addItemQuantity(index)} //call runtime
                            >
                              +
                            </span>
                          </div>
                        )}
                      </div>
                    </section>
                  </section>
                );
              })}
            </div>

            {/* if items is not added subtotal will invisible by default  */}
            {totalPrices > 0 ? (
              <div className="d-flex justify-content-between align-items-center mb-0">
                <p className="h5 fw-bold"> Subtotal {totalPrices}</p>
                <button
                  className="btn btn-danger"
                  data-bs-target="#exampleModalToggle2"
                  data-bs-toggle="modal"
                  // onClick={displayRazorpay}
                >
                  Pay Now
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3">
            <div className="d-flex justify-content-between">
              <h5 className="modal-title mb-4" id="exampleModalToggleLabel2">
                {restaurant.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="">
              <form action="" className="mx-3">
                <div className="mb-2">
                  <label htmlFor="name" className="form-label">
                    User Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter User Name"
                    className="form-control"
                    value={userDetails.name}
                    readOnly={true} //only readable
                    onChange={() => {}}
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="name" className="form-label">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Mobile Number"
                    className="form-control"
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="name" className="form-label">
                    Email Address
                  </label>
                  <div className="input-group ">
                    <input
                      type="email"
                      placeholder="eg.sanjivpaul81"
                      className="form-control"
                      value={userDetails.email}
                      readOnly={true} //only readable
                      onChange={() => {}}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlTextarea1"
                    className="form-label"
                  >
                    Address
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value=""
                    onChange={() => {}}
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="d-flex justify-content-end align-items-center">
              <button
                className="btn btn-primary mt-4 me-3"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
              >
                GO BACK
              </button>
              <button
                className="btn btn-success mt-4"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
                onClick={displayRazorpay}
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* model-end */}
      <section className="row resturant-page-result">
        <section className="col-12 restaurant-main-image mt-5 position-relative">
          <img src={"/images/" + restaurant.image} alt="" />
          <button className="btn-gallery position-absolute btn btn-bg-light">
            Click to see Image Gallery
          </button>
        </section>
        <section className="col-10">
          <h2 className="mt-4">{restaurant.name}</h2>
          <div className="d-flex justify-content-between align-items-start">
            <ul className="list-unstyled d-flex gap-3 fw-bold">
              {/* border-bottom border-3 border-danger */}
              <li className="pb-3 hand" onClick={() => setTab(1)}>
                Overview
              </li>
              <li className="pb-3 hand" onClick={() => setTab(2)}>
                Contact
              </li>
            </ul>
            {userDetails ? (
              <button
                className="btn btn-danger"
                data-bs-toggle="modal"
                href="#exampleModalToggle"
                role="button"
                onClick={getMenuItems}
              >
                Place Online Order
              </button>
            ) : (
              <button className="btn btn-danger" disabled={true}>
                Please Login To Place Order
              </button>
            )}
          </div>
          {/* here tab is used like if else  */}
          {tab === 1 ? (
            <section>
              <h3 className="mb-5">About this place</h3>
              <p className="m-0 fw-bold">Cuisine</p>
              <p className="mb-4 text-muted">
                {restaurant.cuisine.length > 0
                  ? restaurant.cuisine.reduce((pValue, cValue) => {
                      return pValue.name + " " + cValue.name;
                    })
                  : null}
              </p>

              <p className="m-0 fw-bold">Average Cost</p>
              <p className="mb-3 text-muted">
                ₹{restaurant.min_price} for two people (approx.)
              </p>
            </section>
          ) : (
            <section>
              <h3 className="mb-5">Contact</h3>
              <p className="m-0 fw-bold">Contact</p>
              <p className="mb-4 text-danger">+{restaurant.contact_number}</p>

              <p className="m-0 fw-bold">{restaurant.name}</p>
              <p className="mb-3 text-muted">
                {restaurant.locality}, {restaurant.city}
              </p>
            </section>
          )}
        </section>
      </section>
    </>
  );
}
export default ResturantPageResult;
