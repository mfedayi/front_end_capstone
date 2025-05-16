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
