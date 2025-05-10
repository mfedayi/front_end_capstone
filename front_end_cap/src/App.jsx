import "./apiSlices/userSlice"; // force endpoint registration
import { useEffect, useState } from "react";
import bookLogo from "./assets/books.png";
import Login from "./components/Login";
import Home from "./components/Home";
import Navigations from "./components/Navigations";
import Register from "./components/Register";
import UpdateUser from "./components/UpdateUser";
import ChatPage from "./components/ChatPage";
import TeamDetailsPage from "./components/TeamDetailsPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import UserProfile from "./components/UserProfile";
import { useLazyGetMeQuery } from "./apiSlices/userSlice";
import { logout, storeUserProfile } from "./apiSlices/userSlice";

function App() {
  const [fetchGetMe, { data }] = useLazyGetMeQuery();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.userAuth);
  const isLoggedIn = !!profile;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchGetMe();
    }
  }, [fetchGetMe]);

  useEffect(() => {
    if (data) {
      dispatch(storeUserProfile(data));
    }
  }, [data, dispatch]); // store user info globally

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
                <UserProfile />
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
