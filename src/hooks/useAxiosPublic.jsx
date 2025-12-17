import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://warium-ecommerce-server-zl72.onrender.com",
});

//baseURL: 'https://warium-ecommerce-server-api.onrender.com',

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
