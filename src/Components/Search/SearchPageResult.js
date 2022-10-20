import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
//useNavigate=> navigate onepage to another page

function SearchPageResult() {
  let params = useParams(); //params are by default string pattern they have to converted
  let navigate = useNavigate(); // use navigate from one page to another page
  let { meal_id } = params;
  // console.log(meal_id);
  let [resturantList, setResturantList] = useState([]);
  let [locationList, setLocationList] = useState([]);
  let [filter, setFilter] = useState({ meal_type: meal_id });

  let getLocationList = async () => {
    try {
      let response = await axios.get(
        "https://zc-sanjiv-api-app.herokuapp.com/api/get-location"
      );
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

  let filterOperation = async (filter) => {
    let url = "https://zc-sanjiv-api-app.herokuapp.com/api/filter";
    try {
      let { data } = await axios.post(url, filter);
      if (data.status === true) {
        setResturantList([...data.page]); //creating new array with spread operator
      }
    } catch (error) {
      Swal.fire("Server Side Error?", "", "question");
    }
  };

  let makeFiltration = (event, type) => {
    let value = event.target.value;
    let _filter = { ...filter }; //recreate state data to local data
    switch (type) {
      case "location":
        if (Number(value) > 0) {
          _filter["location"] = Number(value); //this is logic of value > 0
        } else {
          delete _filter["location"];
        }
        break;
      case "sort":
        _filter["sort"] = Number(value); //this is logic of value > 0
        break;
      case "cost-for-two":
        let costForTwo = value.split("-");
        // lcost
        // hcost
        _filter["lcost"] = Number(costForTwo[0]);
        _filter["hcost"] = Number(costForTwo[1]);
        break;
      case "page":
        _filter["page"] = Number(value);
        console.log(_filter);
        break;
    }
    console.log(_filter);
    setFilter({ ..._filter });
    filterOperation(_filter);
  };

  useEffect(() => {
    // let filter = {
    //   meal_type: meal_id,
    // };
    filterOperation(filter);
    getLocationList();
  }, []);

  return (
    <>
      <section className="row">
        <div className="col-12">
          <div className="container">
            <p className="h1 fw-bold m-0 py-4 title-text-color">
              Breakfast Places in Mumbai
            </p>
            <div className="row d-flex justify-content-between">
              <div className="col-lg-3 col-md-12 col-12 shadow p-3 filter-section border border-1">
                <div className="container">
                  {/* <!-- Filter --> */}
                  <p className="fw-bold h5 title-text-color">Filters</p>
                  {/* dynamic location */}
                  <label className="my-1" htmlFor="">
                    Select location
                  </label>
                  <select
                    name="select-location"
                    id=""
                    className="form-select"
                    onChange={(event) => makeFiltration(event, "location")} //pass the definition for direct call a function
                  >
                    <option className="state-names" value="-1">
                      --Select location--
                    </option>
                    {locationList.map((location, index) => {
                      return (
                        <option value={location.location_id} key={index}>
                          {location.name},{location.city}
                        </option>
                      );
                    })}
                  </select>

                  {/* <!-- Cusine --> */}
                  <p className="my-2 mt-4 fw-bold title-text-color">Cusine</p>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      value="1"
                    />
                    <label htmlFor="" className="form-check-label">
                      North Indian
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      value="2"
                    />
                    <label htmlFor="" className="form-check-label">
                      South Indian
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      value="3"
                    />
                    <label htmlFor="" className="form-check-label">
                      Chiness
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      value="4"
                    />
                    <label htmlFor="" className="form-check-label">
                      Fast Food
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      value="5"
                    />
                    <label htmlFor="" className="form-check-label">
                      Street Food
                    </label>
                  </div>

                  {/* <!-- cost for two --> */}
                  <p className="my-2 mt-4 fw-bold title-text-color">
                    Cost For Two
                  </p>
                  <div>
                    <input
                      type="radio"
                      className="form-check-input"
                      name="cost-for-two"
                      value="0-500"
                      onChange={(event) =>
                        makeFiltration(event, "cost-for-two")
                      }
                    />
                    <label htmlFor="" className="form-check-label">
                      Less than 500
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      className="form-check-input"
                      name="cost-for-two"
                      value="500-1000"
                      onChange={(event) =>
                        makeFiltration(event, "cost-for-two")
                      }
                    />
                    <label htmlFor="" className="form-check-label">
                      500 to 1000
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      className="form-check-input"
                      name="cost-for-two"
                      value="1000-1500"
                      onChange={(event) =>
                        makeFiltration(event, "cost-for-two")
                      }
                    />
                    <label htmlFor="" className="form-check-label">
                      1000 to 1500
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      className="form-check-input"
                      name="cost-for-two"
                      value="1500-2000"
                      onChange={(event) =>
                        makeFiltration(event, "cost-for-two")
                      }
                    />
                    <label htmlFor="" className="form-check-label">
                      1500 to 2000
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      className="form-check-input"
                      name="cost-for-two"
                      value="2000-999999"
                      onChange={(event) =>
                        makeFiltration(event, "cost-for-two")
                      }
                    />
                    <label htmlFor="" className="form-check-label">
                      2000+
                    </label>
                  </div>

                  {/* <!-- sort --> */}
                  <p className="my-2 mt-4 fw-bold title-text-color">Sort</p>
                  <div className="from-check">
                    <input
                      type="radio"
                      className="form-check-input "
                      name="sort"
                      value="1" //logic from server side => -1 low to high
                      onChange={(event) => makeFiltration(event, "sort")}
                    />
                    <label htmlFor="" className="form-check-label">
                      Price low to high
                    </label>
                  </div>
                  <div className="from-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="sort"
                      value="-1" //logic from server side => -1 high to low
                      onChange={(event) => makeFiltration(event, "sort")}
                    />
                    <label htmlFor="" className="form-check-label">
                      Price high to low
                    </label>
                  </div>
                </div>
              </div>
              {/* <!-- search --> */}
              <div className="col-lg-8 mt-lg-0 col-md-9 mt-md-0 mt-4 me-5">
                <div className="row">
                  {/* <!-- first item --> */}
                  {resturantList.map((resturant, index) => {
                    return (
                      <div
                        className="shadow col-12 py-3 px-4 mb-3 hand"
                        key={index}
                        onClick={() => {
                          navigate("/resturant/" + resturant._id);
                        }}
                      >
                        <div className="d-flex p-3 align-items-center">
                          <img
                            src={"/images/" + resturant.image}
                            alt="breakfast"
                            className="search-items-image"
                          />
                          <div className="ms-3">
                            <p className="m-0 h4 title-text-color">
                              {resturant.name}
                            </p>
                            <p className="m-0 fw-bold title-text-color">
                              {resturant.city}
                            </p>
                            <p className="m-0 text-muted">
                              <i
                                className="fa fa-map-marker me-1"
                                aria-hidden="true"
                              ></i>
                              {resturant.locality}, {resturant.city}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-3">
                            <p className="m-0 text-muted ">CUISINES:</p>
                            <p className="m-0 text-muted ">COST FOR TWO:</p>
                          </div>
                          <div className="col-4">
                            <p className="m-0 title-text-color fw-bold ">
                              {/* reduce method for cuisine */}
                              {resturant.cuisine.reduce((pValue, cValue) => {
                                return pValue.name + "," + cValue.name;
                              })}
                            </p>
                            <p className="m-0 title-text-color fw-bold ">
                              <i className="fa fa-inr" aria-hidden="true"></i>
                              {resturant.min_price}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {/* <!-- second item --> */}
                  {/* <div className="shadow col-12  py-4 px-4 mb-3">
                    <div className="d-flex p-3 align-items-center">
                      <img
                        src="/images/assets/snacks.png"
                        alt="breakfast"
                        className="search-items-image"
                      />
                      <div className="ms-3">
                        <p className="m-0 h4 title-text-color">
                          The Big Chill Cakery
                        </p>
                        <p className="m-0 fw-bold title-text-color">FORT</p>
                        <p className="m-0 text-muted">
                          <i
                            className="fa fa-map-marker me-1"
                            aria-hidden="true"
                          ></i>
                          Shop 1, Plot D, Samruddhi Complex, Chincholi …
                        </p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-3">
                        <p className="m-0 text-muted ">CUISINES:</p>
                        <p className="m-0 text-muted ">COST FOR TWO:</p>
                      </div>
                      <div className="col-3">
                        <p className="m-0 fw-bold title-text-color">Bakery</p>
                        <p className="m-0 fw-bold title-text-color">
                          <i className="fa fa-inr" aria-hidden="true"></i>700
                        </p>
                      </div>
                    </div>
                  </div> */}
                </div>
                <div className="row my-3">
                  <div className="col-12">
                    <nav>
                      <ul className="pagination d-flex justify-content-center">
                        <li className="shadow-sm page-item">
                          <a href="">
                            <i
                              className="fa fa-chevron-left"
                              aria-hidden="true"
                            ></i>
                          </a>
                        </li>
                        <li
                          className="shadow-sm page-item fw-bold"
                          onClick={(event) => makeFiltration(event, "page")}
                        >
                          1
                        </li>
                        <li
                          className="shadow-sm page-item fw-bold"
                          onClick={(event) => makeFiltration(event, "page")}
                        >
                          2
                        </li>
                        <li
                          className="shadow-sm page-item fw-bold"
                          onClick={(event) => makeFiltration(event, "page")}
                        >
                          3
                        </li>
                        <li
                          className="shadow-sm page-item fw-bold"
                          onClick={(event) => makeFiltration(event, "page")}
                        >
                          4
                        </li>
                        <li
                          className="shadow-sm page-item fw-bold"
                          onClick={(event) => makeFiltration(event, "page")}
                        >
                          5
                        </li>
                        <li className="shadow-sm page-item fw-bold">
                          <a href="">
                            <i
                              className="fa fa-chevron-right"
                              aria-hidden="true"
                            ></i>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default SearchPageResult;
