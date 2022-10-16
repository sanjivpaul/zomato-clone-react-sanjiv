# Zomato Clone by Sanjiv Paul

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `npm start`

## **# react-router-dom**

`npm i react-router-dom`

> Integration of react-router-dom

### index.js

> Here {BrowserRouter} enable routing

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./CSS/style.css";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

### App.js

```jsx
import HomePage from "./Components/Home/HomePage";
import SearchPage from "./Components/Search/SearchPage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search-page" element={<SearchPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
```

## **# Client Server Connection**

**1.client & server have:**

- async http request
- async http response

here we are using `axios` library for the http server communication .

**`axios`**=> Promise based HTTP client for the browser and node.js, `axios is used for the make commucation between client and server`.

**2.`axios` and `fetch`**

- Both are used for make connection between client & server.
- fetch is api & axios is a library
- axios make async connection
- fetch api by default available inside a browser

**3.axios**

> installing

`npm i axios`

**4.useEffect** => run the code when component is loading.

`"useEffect => when there is a side effect in components."`

- component loading === mounting stage (for mounting stage we use a hook called useEffect())
- component unloading === unmounting stage
- useEffect runs 3 diff phases
  - useEffect runs when component is mounting (loading)
  - useEffect runs when component will update
  - useEffect runs when component will unmounting
- useEffect have 2 parameters
  - 1.callback function `()=>{}`
  - 2.dependencies list `[]`
    - `[]` ===> empty array it will run once ===> useEffect will run once
- `Hooks` are `async` in nature
  - `useEffect` is `async` in nature
- note: `.get` is a promise i.e we use `async await`

**useEffect** on QuickSearch.js

```jsx
import axios from "axios";
import { useEffect } from "react";

function QuickSearch() {
  let getMealType = async () => {
    // console.log("hello");
    let result = await axios.get("http://localhost:5003/api/get-meal-types");
    console.log(result);
  };
  console.log("js code");
  useEffect(() => {
    // console.log("useEffect code");
    getMealType();
  }, []);
  // [] ===> useEffect will run once
  return <></>;
}
export default QuickSearch;
```

**5.`CORS`** => Cross-Origin Resource Sharing

CORS is used when we are share data from different port and reciving data from different port `cross origin`

> `CORS` pakage is installing on the `api server`

`npm i cors`

**enable cors** on server side app.js

```js
const express = require("express");
const mongoose = require("mongoose");
const app = express();
//instance:
const APIRouter = require("./Routes/APIRouter");
const cors = require("cors");

const PORT = 5003;
// const URI = "mongodb://127.0.0.1:27017/zomatoapi";
// note==> under /db_name?
const URI = `mongodb+srv://sanjivpaul:sanjiv123@batch-48.mmh6xlf.mongodb.net/zomatoapi?retryWrites=true&w=majority`;

app.use(cors()); //enable cors request

// to enable or access post data (body-parser):
app.use(express.json()); //convert string JSON data to pure json data
app.use(express.urlencoded({ extended: false })); //normal post data to json data

app.use("/", APIRouter);

mongoose
  .connect(URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("zomato api is running on port:", PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
```

**note**

- useState() => used for store a data
- useEffect() => is used for execution (onload)

**Trick** => static path

- static + dynamic

```js
//this is static + dynamic path
src={"/images/" + mealType.image}
```

### **Static to dynamic in 4 steps**

- 1.create function for axio.get api
- 2.pass axio.get api function on useEffect
- 3.store data in react useState function
- 4.print dynamic data

- 1.**create function for axio.get api**

```js
let getMealType = async () => {
  try {
    let response = await axios.get("http://localhost:5003/api/get-meal-types");
    let data = response.data;
    if (data.status === true) {
      setMealTypeList([...data.result]); //spread operator for re-create an array
    } else {
      setMealTypeList([]); //id data is not available set as a empty
    }
  } catch (error) {
    alert("server side error");
  }
};
```

- 2.**pass axio.get api function on useEffect**

```js
//useEffect for onload execution
useEffect(() => {
  getMealType();
}, []);
// [] ===> useEffect will run once
```

- 3.**store data in react useState function**

```js
let [mealTypeList, setMealTypeList] = useState([]); // for store data
```

- 4.**print dynamic data**

```jsx
{
  /* mealType cards*/
}
{
  /* to print dynamic we use map() method */
}

{
  mealTypeList.map((mealType, index) => {
    return (
      <div
        key={index}
        className="food-item-container p-0 d-flex justify-content-center align-items-center border border-1 shadow mt-lg-4 mt-md-4 mt-4"
      >
        <img className="quick-search-image" src={"/images/" + mealType.image} />
        <div className="p-1 ms-3">
          <p className="m-0 h5 fw-bold title-color">{mealType.name}</p>
          <p className="m-0 text-muted sub-title-color small mt-1">
            {mealType.content}
          </p>
        </div>
      </div>
    );
  });
}
```

### **useRef** => is like location getElementById()

- to give a reference of a element
- it will give a element reference

### **onChange** in steps

- 1.onChange function
- 2.call the onChange function

- 1.**onChange function**

```js

// let getLocationId = () => {
//   console.log("this is onchange");
// };

let getLocationId = (event) => {
  console.log(event.target.value);
};
```

- 2.**call the onChange function**

```js
<select
  ref={selectInput}
  className="form-select p-2 px-4"
  onChange={getLocationId} //line no:24
>
  {locationList.map((location, index) => {
    return (
      <option value={location.location_id} key={index}>
        {location.name},{location.city}
      </option>
    );
  })}
</select>
```
