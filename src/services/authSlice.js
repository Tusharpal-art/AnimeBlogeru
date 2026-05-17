import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
const initialState = {
  // Safe helper to grab user on refresh
  user: (() => {
    try {
      const stored = localStorage.getItem("user");
      return (stored && stored !== "undefined") ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  })(),
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SetUsers(state, action) {
  const responseData = action.payload.data?.data || action.payload.data || action.payload;

  // Case A: Handling Login/Refresh (Contains AccessToken)
  if (responseData && responseData.accessToken) {
    state.token = responseData.accessToken;
    const decoded = jwtDecode(responseData.accessToken);
    const temp = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/";
    
    state.user = {
      name: decoded[temp + "name"] || "User",
      email: decoded[temp + "emailaddress"] || "",
      profilePicture: decoded.ProfileImage || "",
      id: decoded[temp + "nameidentifier"] || decoded.sub,
      role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "User",
      accessToken: responseData.accessToken // Keep token inside user object for convenience
    };

    localStorage.setItem("token", responseData.accessToken);
    localStorage.setItem("user", JSON.stringify(state.user));
  } 
  // Case B: Handling Profile Update (Partial Data, No Token)
  else if (responseData && (responseData.name || responseData.profileImgPath)) {
    state.user = {
      ...state.user,
      name: responseData.name || state.user.name,
      // Map 'profileImgPath' from API to 'profilePicture' in state
      profilePicture: responseData.profileImagePath || state.user.profilePicture
    };
    
    localStorage.setItem("user", JSON.stringify(state.user));
    console.log("Profile state updated via partial data");
  }
},
    RemoveUser(state) {
      state.user = null;
      state.token = null;
      // Clear everything on logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { SetUsers, RemoveUser } = authSlice.actions;
export default authSlice.reducer;