import defaultAxios from "axios";
import { buildKeyGenerator, setupCache } from "axios-cache-interceptor";
import { errorToast } from "../components/customToast";
import { getCurrentEnvironment, removeCookie } from "../utils/utilities";

const instance = defaultAxios.create();
const axios = setupCache(instance, {
  ttl: 1, // 5 minute.
  methods: ["get"],
  generateKey: buildKeyGenerator((request) => ({
    method: request.method,
    url: request.url,
  })),
});

axios.interceptors.request.use(
  async (config) => {
    config.headers["Authorization"] = localStorage.getItem("interfaceToken");
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
// response interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    if (error?.response?.status === 401) {
      removeCookie(getCurrentEnvironment());
      localStorage.clear();

      const redirectUrl = new URL(window.location.origin);

      redirectUrl.searchParams.append("error", "session expired");

      window.location.href = redirectUrl.href;
    }
    if (error?.response?.status >= 500) {
      errorToast("Server Error, Try again later");
    }

    return Promise.reject(error);
  }
);

export default axios;
