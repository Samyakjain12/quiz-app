import axios from "axios";
export const apiCallWithAuth = async (endpoint,method = "get",body = {},contentType = "application/json") => {
    try {
      const token = process.env.NEXT_PUBLIC_AUTH_TOKEN
      const headers = {
        Accept: "application/json",
        "Content-Type": contentType,
        Authorization: token,
      }; 
      const resp = await axios({method,baseURL:process.env.NEXT_PUBLIC_SERVICE,url:endpoint,data: body,params: method.toLowerCase() === "get" ? body : null,paramsSerializer: toQueryString,
        transformRequest: (data) => {
          if (Object.prototype.toString.call(data) === "[object FormData]") {
            return data;
          }
          if (Object.prototype.toString.call(data) === "[object Array]") {
            return JSON.stringify(data);
          }
          const res = {};
          Object.keys(data).forEach((key) => {
            res[key] = data[key];
          });
          return JSON.stringify(res);
        },
        headers,
      })
        .then((response) => response.data)
        .catch((error) => error);
      return resp;
    } catch (error) {
      console.error('api call error', error);
      return error?.response?.data || {};
    }
  };


const toQueryString = (obj) => {
    const keys = Object.keys(obj)
    keys.sort()
    const parts = []
    for (const field in keys) {
      const key = keys[field]
      if (obj.hasOwnProperty(key) && !!obj[key] && !!obj[key].toString().length) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]).replace(/%20/g, '+'))
      }
    }
    return parts.join('&')
  }