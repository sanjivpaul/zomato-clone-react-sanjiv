import HomePage from "./Components/Home/HomePage";
import SearchPage from "./Components/Search/SearchPage";
import { Routes, Route } from "react-router-dom";
import ResturantPage from "./Components/Resturant/ResturantPage";

function App() {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search-page/:meal_id" element={<SearchPage />} />
          <Route path="/resturant/:id" element={<ResturantPage/>}/>
        </Routes>
      </main>
    </>
  );
}

export default App;
