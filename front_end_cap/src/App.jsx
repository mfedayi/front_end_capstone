import { useEffect } from "react";
import Login from "./components/Login";
import Home from "./components/Home";
import Navigations from "./components/Navigations";
import Register from "./components/Register";
import UpdateUser from "./components/UpdateUser";
import { useGetMeQuery } from "./slices/userSlice";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const tokenExists = !!localStorage.getItem("token");
  useGetMeQuery(undefined, {
    skip: !tokenExists,
  });

  return (
    <>
      <header className="app-header">
        <h1 className="app-title">
          Welcome Home
        </h1>
      </header>

      <BrowserRouter>
        <Navigations />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/update-user/:userId" element={<UpdateUser />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
