import axios, { AxiosTransformer } from '../../src/index';
import qs from 'qs';

// const a = { a: 1};
// console.log(qs.stringify(a))
/**
 * example-1
 */
// axios.defaults.headers.common['test2'] = 123;
// axios.interceptors.request.use(config => {
//   console.log('config', config);
//   return config
// })

// debugger;
// axios({
//   method: 'post',
//   url: '/config/post',
//   data: qs.stringify({ a: 1 }),
//   headers: {
//     test: '321'
//   }
// }).then(response => {
//   console.log(response.data);
// });

/**
 * example-2
 */
// axios({
//   transformRequest: [
//     (function (data, headers) {
//       console.log((data));
//       debugger;
//       // headers['Content-Type'] = 'application/x-www-urlencoded'
//       return qs.stringify(data);
//       // return data
//     }),
//     ...(axios.defaults.transformRequest as AxiosTransformer[])
//   ],
//   transformResponse: [
//     ...(axios.defaults.transformResponse as AxiosTransformer[]),
//     function (data) {
//       if (typeof data === 'object') {
//         data.b = 2;
//       }
//       return data;
//     }
//   ],
//   url: '/config/post',
//   method: 'post',
//   data: {
//     a: 1
//   }
// }).then(response => {
//   console.log(response.data);
// });

/**
 * example-3
 */
const instance = axios.create({
  transformRequest: [
    (function (data) {
      return qs.stringify(data);
    }),
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransformer[]),
    function (data) {
      if (typeof data === 'object') {
        data.b = 2;
      }
      return data;
    }
  ],
});

instance({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then(response => {
  console.log(response.data);
});