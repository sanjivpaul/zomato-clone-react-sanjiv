import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function QuickSearch() {
  let navigate = useNavigate(); //instance of it

  // for work with a data we use a list useState list
  let [mealTypeList, setMealTypeList] = useState([]); // for store data

  let getMealType = async () => {
    // console.log("hello");
    try {
      let response = await axios.get(
        "http://localhost:5003/api/get-meal-types"
      );
      let data = response.data;
      if (data.status === true) {
        setMealTypeList([...data.result]); //spread operator for re-create an array
      } else {
        setMealTypeList([]); //id data is not available set as a empty
      }
    } catch (error) {
      Swal.fire("Server Side Error?", "", "question");
    }
  };
  let getQuickSearchPage = (id) => {
    navigate("/search-page/" + id); //there we are useing params id for dynamic, page no:58
  };

  //useEffect for onload execution
  useEffect(() => {
    getMealType();
  }, []);
  // [] ===> useEffect will run once

  return (
    <>
      {/* <!-- Quick Search container --> */}
      <section className="container my-3">
        <p className="h1 fw-bold title-color">Quick Searches</p>
        <p className="h5 my-3 mb-5 sub-title-color">
          Discover restaurants by type of meal
        </p>

        {/* <!-- quick search items --> */}
        <div className="container quick-search-container mt-4 mx-lg-0 mx-md-0 mx-5 d-flex justify-content-between flex-wrap">
          {/* mealType cards*/}

          {/* to print dynamic we use map() method */}

          {mealTypeList.map((mealType, index) => {
            return (
              <div
                key={index}
                className="food-item-container p-0 d-flex justify-content-center align-items-center border border-1 shadow mt-lg-4 mt-md-4 mt-4"
                onClick={() => {
                  getQuickSearchPage(mealType.meal_type);
                }} //params we pass there meal type id
              >
                <img
                  className="quick-search-image"
                  src={"/images/" + mealType.image}
                />
                <div className="p-1 ms-3">
                  <p className="m-0 h5 fw-bold title-color">{mealType.name}</p>
                  <p className="m-0 text-muted sub-title-color small mt-1">
                    {mealType.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
export default QuickSearch;
