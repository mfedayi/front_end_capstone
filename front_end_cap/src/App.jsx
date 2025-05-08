import "./apiSlices/teamSlice"; // force endpoint registration
import { useEffect, useState } from "react";
import bookLogo from "./assets/books.png";
import Login from "./components/Login";
import Home from "./components/Home";
import Navigations from "./components/Navigations";
import Register from "./components/Register";
import UpdateUser from "./components/UpdateUser";
import ChatPage from "./components/ChatPage";
//import Account from "./components/Account";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.userAuth.isLoggedIn);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setLoggedIn());
    }
  }, [dispatch]);

  return (
    <>
      <header className="app-header">
        <h1 className="app-title">
          {}
          Welcome Home
        </h1>
      </header>

      <BrowserRouter>
        <Navigations isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teams/:teamName" element={<TeamDetailsPage />} />
          <Route path="/update-user/:userId" element={<UpdateUser />} />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <Account />
              </PrivateRoute>
            }
          />
          <Route path="/chat" element={<ChatPage />} />
          {/* <Route path="/books/:id" element={<SingleBook />} /> */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
