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
      // Extract data based on your API response structure
      const responseData = action.payload.data?.data || action.payload.data || action.payload;

      if (responseData && responseData.accessToken) {
         // This contains name, profileImage, etc.
        state.token = responseData.accessToken;

         const decoded = jwtDecode(responseData.accessToken);
          console.log("Decoded JWT Data:", decoded);   
          const temp = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/";
           state.user = {
            name: decoded[temp + "name"] || "User",
            email:  decoded[temp + "emailaddress"] || "",
            // Use image from token OR from the API response if token doesn't have it
            profilePicture: decoded.ProfileImage || "",
            id:  decoded[temp + "nameidentifier"] || decoded.sub,
            role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]|| "User"
           }; 
           console.log(state.user.name)
        // CRITICAL: Save BOTH to localStorage
        localStorage.setItem("token", responseData.accessToken);
        console.log("authSlice User",state.user)
        localStorage.setItem("user", JSON.stringify(state.user)); 
        
        console.log("Login Success: Token & User saved");
      } else {
        console.error("Login Error: AccessToken missing in payload");
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