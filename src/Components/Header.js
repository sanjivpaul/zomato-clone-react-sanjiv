import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useState } from "react";
import Swal from "sweetalert2";

function Header(props) {
  let navigate = useNavigate(); //instance of use navigate

  let getTokenDetails = () => {
    //read the data from localStorage
    let token = localStorage.getItem("auth-token");
    if (token === null) {
      return false;
    } else {
      return jwt_decode(token);
    }
  };

  let [userLogin, setUserLogin] = useState(getTokenDetails());

  let onSuccess = (credentialResponse) => {
    let token = credentialResponse.credential;

    //save the data
    localStorage.setItem("auth-token", token); //pass key and data

    //sweet alert is a promise so after that we can use then method and in this then method we can directly fire the message
    Swal.fire({
      icon: "success",
      title: "Login Successfully",
      text: "",
    }).then(() => {
      // window.location.assign("/"); //refresh page automatically
      window.location.reload("/");
    });
  };

  let onError = () => {
    // alert("Login Fail");
    Swal.fire({
      icon: "error",
      title: "Opps...",
      text: "Login Fail Try Again",
    });
  };
  // console.log(userLogin);

  //remove token for logout
  let logout = () => {
    Swal.fire({
      title: "Are you sure to Logout?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout me!",
    }).then((result) => {
      if (result.isConfirmed) {
        //remove the data from localStorage
        //removeItem
        localStorage.removeItem("auth-token");
        window.location.reload("/");
        // window.location.assign("/"); //refresh page
        setUserLogin(false); //reset our form
      }
    });
  };

  return (
    <>
      <GoogleOAuthProvider clientId="21756234185-018scif581tarcgglqk5u07mccv8j0v4.apps.googleusercontent.com">
        {/* <!-- Modal --> */}
        <div
          className="modal fade"
          id="google-sign-in"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Google Sing-In
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* google login button */}
                <GoogleLogin onSuccess={onSuccess} onError={onError} />
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <p>Don’t have account? Sign UP</p>
              </div>
            </div>
          </div>
        </div>
        {/* Modal End */}
        <header className="row">
          <div className={"col-12 " + props.color}>
            <div className="container d-flex justify-content-between align-items-center py-2">
              <p
                className="brand-name text-danger m-0 h3 hand"
                onClick={() => navigate("/")} //run time function
              >
                e!
              </p>
              {/* if user is login show the name of the user */}
              {userLogin ? (
                <div>
                  <span className="fs-5 text-white fw-bold me-2">
                    Welcome, {userLogin.given_name}
                  </span>
                  <button className="btn-create-account" onClick={logout}>
                    {/* logout logic is => when token is removed user autnomatically logout */}
                    <i className="fa fa-exit" area-hidden="true"></i> Logout
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    className="btn-login"
                    data-bs-toggle="modal"
                    data-bs-target="#google-sign-in"
                  >
                    Login
                  </button>
                  <button className="btn-create-account">
                    <i className="fa fa-search" area-hidden="true"></i> Create
                    an Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      </GoogleOAuthProvider>
      ;
    </>
  );
}
export default Header;
