import Server from './server';
import { Toast } from '@/components';

class API extends Server{
  async Get(url, datas, errObj={}){
    // console.log('getArguments',url, datas, errObj)
    try{
      let result = await this.axios('get', url, datas);
      const { data, errormsg, success } = result;
      if (typeof result === "object"){
        console.log("Get_result",data);
      } else {
        console.log("Get_result", result);
      }
      if (success) {
        return { success, data };
      } else if (typeof result === "string") {
        return {
          success: result ? true : false,
          data: result,
        };
      } else {
        Toast.info(errormsg);
        let err = { success, ...errObj, errormsg };
        throw err;
      }
    } catch(err){
      console.log("Get_result_err", err); 
      const { code, errormsg, msg, success } = err;
      if(code === -1){
        console.log('重新登录')
      }
      return {
        success,
        errormsg,
        code,
        msg
      }
    }
  }

  async Post(url, datas, errObj={}) {
    // console.log('postArguments',url, datas, errObj)
    try{
      let result = await this.axios("post", url, datas);
      const { data, errormsg, success } = result;
      if (typeof result === "object") {
        console.log("Post_result", data, success, errormsg );
      } else {
        console.log("Post_result", result);
      }
      if (success) {
        return { success, data };
      } else if (typeof result === "string") {
        return {
          success: result ? true : false,
          data: result,
        };
      } else {
        Toast.info(errormsg);
        let err = { success, ...errObj, errormsg };
        throw err;
      }
    } catch(err){
      console.log("Post_result_err", err);
      const { code, errormsg, msg, success } = err;
      if(code === -1){
        console.log('重新登录')
      }
      return {
        success,
        errormsg,
        code,
        msg
      }
    }
  }
}

export default {
  get(url, datas, errObj) {
    return new API().Get(url, datas, errObj);
  },
  post(url, datas, errObj) {
    return new API().Post(url, datas, errObj);
  },
};