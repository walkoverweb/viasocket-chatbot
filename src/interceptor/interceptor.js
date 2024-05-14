import defaultAxios from "axios";
import { buildKeyGenerator, setupCache } from "axios-cache-interceptor";
// import { store } from '../store'
import {
  getFromCookies,
  // getSubdomain,
  removeCookie,
  getCurrentEnvironment,
} from "../utils/utilities";
import { intefaceGetLocalStorage } from "../pages/interface/utils/InterfaceUtils.ts";
import { errorToast } from "../components/customToast";

const WHITELISTED_URL = [
  "/dbdash/getplugin",
  // /^(https?|http):\/\/[^/]+\/projects\/[a-zA-Z0-9]+\/scripts\?type=flow$/
];

const instance = defaultAxios.create();
const axios = setupCache(instance, {
  ttl: 1000 * 60 * 5, // 5 minute.
  methods: ["get"],
  generateKey: buildKeyGenerator((request) => ({
    method: request.method,
    url: request.url,
  })),
});

// const urlParams = new URLSearchParams(window.location.search)

// const headerKey = (key) => {
//   let head = key === 'accessToken' ? 'Authorization' : key
//   head =
//     (urlParams.get('mode') === MiscTypes.EMBED_MODE || urlParams.get('state'))
//       ? 'Authorization'
//       : head
//   return head
// }
// request interceptor
axios.interceptors.request.use(
  async (config) => {
    let key;
    if (process.env.REACT_APP_API_ENVIRONMENT === "local") {
      config.headers["proxy_auth_token"] =
        localStorage.getItem("proxy_auth_token");
      key = "Authorization";
    } else key = "proxy_auth_token";
    if (intefaceGetLocalStorage("interfaceToken")) {
      key = "Authorization";
    }
    const token = getFromCookies(getCurrentEnvironment());
    // const urlParams = new URLSearchParams(window.location.search)
    // const modeInQueryParams = urlParams.get('mode')

    config.headers[key] = token;
    // const { mode } = {
    //   mode: modeInQueryParams || store.getState()?.appInfo?.mode
    // }

    // token =
    //   mode === MiscTypes.FLOW || mode === MiscTypes.OAUTH_MODE
    //     ? getFromCookies(getCurrentEnvironment())
    //     : sessionStorage.getItem('ssoEmbedToken')
    // if (token) {

    //   if (intefaceGetLocalStorage('interfaceToken')) {
    //     key = 'Authorization'
    //     token = intefaceGetLocalStorage('interfaceToken')
    //     config.headers[key] = token
    //   } else config.headers[key] = token
    // } else if (intefaceGetLocalStorage('interfaceToken')) {
    //   key = 'Authorization'
    //   token = intefaceGetLocalStorage('interfaceToken')
    //   config.headers[key] = token
    // }
    if (
      WHITELISTED_URL.some((urlToWhilteList) => {
        return !!config.url.match(urlToWhilteList);
      })
    ) {
      config.cache = {};
    } else {
      config.cache = false;
    }
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
