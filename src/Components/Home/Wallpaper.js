import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Header from "../Header";
import Swal from "sweetalert2";

function Wallpaper() {
  // let selectInput = useRef(); // it will give a element reference
  let [locationList, setLocationList] = useState([]);
  let [disabled, setDisabled] = useState(true);

  let getLocationList = async () => {
    try {
      let response = await axios.get("https://zc-sanjiv-api-app.herokuapp.com/api/get-location");
      let data = response.data;
      if (data.status === true) {
        setLocationList([...data.result]);
      } else {
        setLocationList([]);
      }
      // console.log(data);
    } catch (error) {
      console.log(error);
      Swal.fire("Server Side Error?", "", "question");
    }
  };

  let getLocationId = async (event) => {
    let value = event.target.value;
    // console.log(value);
    //if vaqlue is not equal to empty
    // if (value !== "") {
    //   setDisabled(false);
    // } else {
    //   setDisabled(true);
    // }

    //if my value is not empty then run this code
    if (value !== "") {
      try {
        let url =
          "https://zc-sanjiv-api-app.herokuapp.com/api/get-resturant-by-location-id/" + value;
        let { data } = await axios.get(url); //destructuring
        // console.log(data);
        if (data.status === true) {
          if (data.result.length === 0) {
            setDisabled(true);
          } else {
            setDisabled(false);
          }
        }
      } catch (error) {
        console.log(error);
        Swal.fire("Server Side Error?", "", "question");
      }
    }
  };

  useEffect(() => {
    getLocationList();
  }, []); //[] ==> run it only once (onload i.e mounting stage)

  return (
    <>
      <section className="mainContainer">
        {/* <!-- HeaderArea --> */}
        <div className="col-12">
          <Header color="" />
        </div>
        {/* <!-- brand Area --> */}
        <section className="container d-flex p-2 flex-column justify-content-center align-items-center">
          <div className="row brand">
            <div className="col-12">
              <p className="text-center fw-bold brand-logo">e!</p>
            </div>
          </div>
          <div className="row">
            <p className="col-lg-12 col-md-12 col-12 text-white fw-bold h2 text-center">
              Find the best restaurants, cafés, and bars
            </p>
          </div>
          {/* <!-- location and reasturants search area --> */}
          <div className="row home-page-input d-flex justify-content-center align-items-center">
            <div className="col-lg-5 col-md-8 col-8 p-3">
              <div className="location-search d-flex justify-content-center align-items-center">
                {/* Dynamic-Location */}
                <select
                  // ref={selectInput}
                  className="form-select p-2 px-4"
                  onChange={getLocationId} //line no:24
                >
                  <option value="">Please type a location</option>
                  {locationList.map((location, index) => {
                    return (
                      <option value={location.location_id} key={index}>
                        {location.name},{location.city}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="col-lg-7 col-8 mt-lg-0 mt-md-0 d-flex justify-content-center">
              <div className="input-group resturant-search">
                <span className="input-group-text bg-white">
                  <i className="fa fa-search" aria-hidden="true"></i>
                </span>
                <input
                  className="resturant form-control p-2"
                  aria-label="Username"
                  type="text"
                  placeholder="Search for resturant, cuisine or a dish"
                  disabled={disabled} // line no:8 ==> this is like a switch
                />
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
export default Wallpaper;
