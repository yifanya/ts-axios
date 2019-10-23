import axios, { AxiosError } from '../../src/index';
// import 'nprogress/nprogress.css';
// import NProgress from 'nprogress';
import qs from 'qs';

/**
 * CORS
 */
// document.cookie = 'a=b';

// axios.get('/more/get').then(res => {
//   console.log(res);
// });

// axios.post('http://localhost:8088/more/server2', {}, {
//   withCredentials: true,
// }).then(res => {
//   console.log(res);
// });

// /**
//  * XSRF防御
//  */
// const instance = axios.create({
//   xsrfCookieName: 'XSRF-TOKEN-D',
//   xsrfHeaderName: 'X-XSRF-TOKEN-D'
// });

// instance.get('/more/get').then(res => {
//   console.log(res);
// });

/**
 * HTTP 授权
 */
// axios.post('/more/post', {
//   a: 1,
// }, {
//   auth: {
//     username: 'Yee',
//     password: '123456'
//   }
// }).then(res => {
//   console.log(res);
// });

/**
 * 自定义状态码校验规则
 */
// axios.get('/more/304').then(res => {
//   console.log(res);
// }).catch((e: AxiosError) => {
//   console.log(e.message);
// });

// axios.get('/more/304', {
//   validateStatus(status) {
//     return status >= 200 && status < 400;
//   }
// }).then(res => {
//   console.log(res);
// }).catch((e: AxiosError) => {
//   console.log(e.message);
// });

/**
 * 扩展静态方法
 */
function getA() {
  return axios.get('/more/A');
}

function getB() {
  return axios.get('/more/B');
}

axios.all([getA(), getB()])
  .then(axios.spread(function (resA, resB) {
    console.log(resA);
    console.log(resB);
  }));

axios.all([getA(), getB()])
  .then(([resA, resB]) => {
    console.log(resA);
    console.log(resB);
  });

const fakeConfig = {
  baseURL: 'https://www.baidu.com/',
  url: '/user/12345',
  params: {
    idClient: 1,
    idTest: 2,
    testString: 'thisIsATest'
  }
};

console.log(axios.getUrl(fakeConfig));
