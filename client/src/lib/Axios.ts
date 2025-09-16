import axios from "axios";

const Axios = axios.create({
  // baseURL: "http://localhost:8080/api/v1",
  baseURL: "https://api.lead.indibus.net/api/v1",
  withCredentials: true,
});

export default Axios;
