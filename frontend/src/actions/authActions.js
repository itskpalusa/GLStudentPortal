import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { ADD_ERROR, SET_CURRENT_USER, GET_USERS, GET_USER } from "./types";

// Register User
export const register = userData => dispatch => {
  return new Promise((resolve, reject) => {
    clearErrors(dispatch);
    axios
      .post("/api/users/register", userData)
      .then(res => {
        const { token, user } = res.data;

        // Set token to ls
        localStorage.setItem("jwtToken", token);

        // Set token to Auth header
        setAuthToken(token);

        // Decode token to get user data
        const decoded = jwt_decode(token);

        // Set current user
        dispatch(setCurrentUser(decoded));

        // .then in parent
        resolve(user);
      })
      .catch(err =>
        reject(
          dispatch({
            type: ADD_ERROR,
            payload: err.response.data
          })
        )
      );
  });
};

// Get All Users
export const getUsers = () => dispatch => {
  axios
    .get("/api/users/all")
    .then(res => {
      dispatch({
        type: GET_USERS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: ADD_ERROR,
        payload: err.response.data.data
      })
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  clearErrors(dispatch);
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;

      // Set token to ls
      localStorage.setItem("jwtToken", token);

      // Set token to Auth header
      setAuthToken(token);

      // Decode token to get user data
      const decoded = jwt_decode(token);

      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: ADD_ERROR,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const getCurrentUser = () => dispatch => {
  clearErrors(dispatch);
  axios
    .get("/api/users/getCurrent")
    .then(res =>
      dispatch({
        type: GET_USER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: ADD_ERROR,
        payload: err.response.data
      })
    );
};
