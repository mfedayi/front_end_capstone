// **Auth Flow Cheat Sheet: Manual vs Matcher-Based Setup**

// | Feature                            | Without Matchers (Manual Setup)                                                                                           | With Your Matcher-Based Setup                                                                                            |
// | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
// | **Persistent login after refresh** | `isLoggedIn` always starts as false, even if a token exists in localStorage. User may appear logged out or see a flicker. | `isLoggedIn` is initialized from `!!localStorage.getItem('token')`, so the app knows immediately if a user is logged in. |
// | **Auto-profile population**        | You have to manually dispatch user data to Redux after calling `getMe`:                                                   |                                                                                                                          |

useEffect(() => {
  if (data) dispatch(storeUserProfile(data));
}, [data]);
// ``` | Handled automatically via matcher:

builder.addMatcher(getMe.matchFulfilled, storeProfile);
// ``` |
// | **Clean login/register flows**    | Manually store token and update auth state:
localStorage.setItem('token', res.token);
dispatch(setLoggedIn());
// ``` | Handled by centralized matcher:
builder.addMatcher(register.matchFulfilled, storeTokenAndSetAuthStatus);
builder.addMatcher(login.matchFulfilled, storeTokenAndSetAuthStatus);
//  |
// | **Scalable & self-healing logic** | Logic is scattered and repeated; harder to maintain.                                                            | All auth logic is centralized in `userSlice.js` via matchers. Easy to extend.                                            |

// ---

// **Why Your Setup Is Better:**

// - **Reusable**: Same logic applies to `register`, `login`, and `getMe`.
// - **Consistent**: Prevents bugs caused by forgetting to update Redux or localStorage.
// - **Fast**: App reads auth state immediately on load via `localStorage`.
// - **Clean UI**: No flicker, no redundant dispatching, and fewer bugs.

// Let me know if you'd like this adapted into a GitHub README, blog post, or tutorial!

````

//old App.jsx
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
import { useLocation } from "react-router-dom";
import "./styles/ball-theme.css";

function App() {
  const { isLoading } = useGetMeQuery();
  const location = useLocation();
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

