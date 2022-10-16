import Header from "../Header"
import SearchPageResult from "./SearchPageResult";

function SearchPage() {
  return (
    <>
      <main className="container-fluid">
        <Header color='bg-danger'/>
        <SearchPageResult />
      </main>
    </>
  );
}
export default SearchPage;
