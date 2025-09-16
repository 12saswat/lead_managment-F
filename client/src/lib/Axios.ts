import axios from "axios";

const Axios = axios.create({
  // baseURL: "http://localhost:8080/api/v1",
  baseURL: "https://lead-managment-b.onrender.com",
  withCredentials: true,
});

export default Axios;
