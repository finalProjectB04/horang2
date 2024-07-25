import axios from "axios";
// import { setupCache } from "axios-cache-adapter";

// const cache = setupCache({
//   maxAge: 15 * 60 * 1000,
// });

const instance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
  // adapter: cache.adapter,
});

export default instance;
