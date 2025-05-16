import "./apiSlices/userSlice"; // force endpoint registration
import { useEffect, useState } from "react";
import Login from "./components/Login";
import Home from "./components/Home";
import Navigations from "./components/Navigations";
import Register from "./components/Register";
import UpdateUser from "./components/UpdateUser";
import ChatPage from "./components/ChatPage";
import AdminAccount from "./components/AdminAccount";
import TeamDetailsPage from "./components/TeamDetailsPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import UserProfile from "./components/UserProfile";
import { useGetMeQuery } from "./apiSlices/userSlice";
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const { isLoading } = useGetMeQuery();
  const dispatch = useDispatch();
  const { isLoggedIn, profile } = useSelector((state) => state.userAuth);
  if (!profile && isLoading) return null;

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     fetchGetMe();
  //   }
  // }, [fetchGetMe]);

  // useEffect(() => {
  //   if (userData) {
  //dispatch(storeUserProfile(userData)); // manual update
  //   }
  // }, [userData, dispatch]); . No need to manually dispatch as RTK Query + matcher is already doing it in the userSlice

  return (
    <>
      <header className="app-header">
        <h1 className="app-title">
          {}
          Sixth Man Club
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
            path="/user/:userId"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute requireAdmin>
                <AdminAccount />
              </PrivateRoute>
            }
          />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;