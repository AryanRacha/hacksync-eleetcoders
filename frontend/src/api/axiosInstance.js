import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://hacksync-eleetcoders-uqag.vercel.app/api',
    withCredentials: true,
});

export default axiosInstance;
