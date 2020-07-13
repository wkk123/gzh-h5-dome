import axios from 'axios';
import { baseUrl} from '@/config/index';
import { getLocal, urlResolver }  from '@/utils/commons';
import qs from 'qs';
import moment from "moment";


//  @params method {string} 方法名
//  @params url {string} 请求地址  例如：/login 配合baseURL组成完整请求地址
//  @params baseURL {string} 请求地址统一前缀 ***需要提前指定** 例如：http://cangdu.org
//  @params timeout {number} 请求超时时间 默认 30000
//  @params params {object}  get方式传参key值
//  @params headers {string} 指定请求头信息
//  @params withCredentials {boolean} 请求是否携带本地cookies信息默认开启
//  @params validateStatus {func} 默认判断请求成功的范围 200 - 300
//  @return {Promise}
//  其他更多拓展参看axios文档后 自行拓展
//  注意：params中的数据会覆盖method url 参数，所以如果指定了这2个参数则不需要在params中带入

const dt = 3;
export default class Server{
  
  axios(method, url, data){
    let Authorization = getLocal('userInfo')?urlResolver(getLocal('userInfo')).Token:'';
    return new Promise((resolve, reject) => {
      let userDefined = {
        dt: dt,
      };
      let publicDate = {
        TimeStamp: moment().format("YYYYMMDDHHmmss"),
        RandomId: moment().format("YYYYMMDDHHmmss").toString() + parseInt(Math.random() * 1000000),
      };
      if (Authorization) {
        publicDate.Token= Authorization;
        userDefined.Authorization= Authorization;
      };
      let newData = {
        ...data,
        ...publicDate,
      };
      let _option = {
        method: method.toUpperCase(),
        url: baseUrl + url,
        timeout: 60000,
        params: method.toUpperCase() === "GET" ? newData : {},
        data: qs.stringify(method.toUpperCase() === "POST" ? newData : {}),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          ...userDefined,
        },
        validateStatus: (status) => {
          return status >= 200 && status < 300;
        },
      };
      // console.log('option-----',_option);
      axios.request(_option).then(res => {
        // console.log('res----',res);
        console.log( "%cstatus: " + res.status + "%c code: " + res.data.code + "%c errormsg: "+res.data.errormsg, "color:#f00;", "color:#068e06;", "color:blue;",`${new Date().toLocaleString()}【 M=${res.config.url} 】`);
        // console.log(typeof res.data,res.data,res);
        if (typeof res.data === "string") {
          resolve(res.data);
        } else {
          resolve(
            typeof res.data === "object" ? res.data : JSON.parse(res.data)
          );
        };
      },error =>{
        // console.log('error----',error);
        if (error.response) {
          reject(error.response.data)
        } else{
          reject(error)
        }
      })
    })
  }
}