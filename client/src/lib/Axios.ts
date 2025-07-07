import axios from 'axios';

const Axios = axios.create({
    // baseURL: "http://localhost:8080/api/v1",
    baseURL:"https://ipr01250601001b.onrender.com/api/v1",
    withCredentials: true
})

export default Axios;
