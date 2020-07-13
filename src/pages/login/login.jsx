import React, { Component } from 'react';
import { imgUrl } from '@/config';
import './login.scss';
import store from '@/store/index';

class login extends Component {
  state = {
    ...store.getState()
  }
  componentDidMount() {
    
  }
  // 手机号登录
  btnLogin =()=>{
    const { query } = this.props.location;
    if(!query){
      return this.props.history.replace('/mine');
    }
    const { query:{ pathname } } = this.props.location;
    this.props.history.replace({pathname:'account',query:{pathname:pathname}})
  }
  render() {
    const { companyInfo:{ companyName, logoUrl, subTitle } } = this.state;
    return (
      <div className='login'>
        <div className='login_box'>
          <div className='login_info'>
            {logoUrl&&<img className='info_img' src={imgUrl + 'logo/'+ logoUrl} alt="logo" />}
            {(Number(subTitle) !== 2)&&<span className='info_title'>{ companyName }</span>}
          </div>
          <div className='login_btn'>
            <button 
              className='btn_item'
              onClick={()=>{this.btnLogin()}}
            >手机号登录</button>
          </div>
        </div>  
      </div>
    )
  }
}

export default login