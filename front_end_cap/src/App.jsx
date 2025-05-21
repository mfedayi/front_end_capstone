import "./apiSlices/userSlice"; 
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
import PublicUserProfile from "./components/PublicUserProfile"; 
import { useGetMeQuery } from "./apiSlices/userSlice";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useLocation } from "react-router-dom";
import "./styles/ball-theme.css";


function App() {
  const { isLoading } = useGetMeQuery();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoggedIn, profile } = useSelector((state) => state.userAuth);

  if (!profile && isLoading) return null;

  const getBackgroundClass = () => {
    if (location.pathname.includes("/chat")) return "chat-bg";
    if (location.pathname.includes("/user")) return "profile-bg";
    return "home-bg";
  };




  return (
    <div className={getBackgroundClass()}>
      <header className="app-header shadow-lg">
        <h1 className="app-title">
          🏀 <span className="club-name">Sixth Man Club</span>
        </h1>
      </header>

      <Navigations isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:userId" element={<PublicUserProfile />} /> 
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
    </div>
  );
}

export default App;