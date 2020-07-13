import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Toast } from '@/components';
import { phoneRegExp } from '@/utils/commons';
import PropTypes from 'prop-types';
import { saveUserInfo } from '@/store/actions';
import './account.scss';
import { getCode, getUserInfo } from "@/api/api";
import classnames from 'classnames';

class account extends Component {
  static propTypes = {
    userInfo: PropTypes.object.isRequired,
    saveUserInfo: PropTypes.func.isRequired,
  }
  state = {
    mobile:'',//手机号
    verificationCode:'',//验证码
    isAccount: false,// 
    countDown: 10,//获取验证码倒计时
  }
  componentDidMount() {
    
  }
  componentWillUnmount () {
    clearTimeout(this.timer)
  }
  // 输入手机号
  mobileChange =(e)=>{
    this.setState({
      mobile: e.target.value
    })
  }
  // 输入验证码
  codeChange =(e)=>{
    this.setState({
      verificationCode: e.target.value
    })
  }
  // 获取验证码
  getVerification =()=>{
    const { mobile } = this.state;
    if(!phoneRegExp(mobile)){
      return Toast.info('请输入有效手机号');
    }
    this.setState({
      isAccount: true
    })
    this.countDownFun()
    getCode(mobile)

  }
  // 10s倒计时
  countDownFun(){
    let { countDown } = this.state;
    if(countDown>0){
      this.timer = setTimeout(()=>{
        this.setState({
          countDown: countDown-1
        })
        this.countDownFun()
      },1000)
    } else {
      this.setState({
        countDown: 10,
        isAccount: false,// 
      })
    }
  }

  // 登录
  loginBtn =()=>{
    const { mobile, verificationCode } =this.state;
    if(!mobile){
      return Toast.info('手机号不能为空!');
    } else if(!verificationCode){
      return Toast.info('验证码不能为空!');
    }
    getUserInfo(mobile, verificationCode).then(({ success, data})=>{
      if (success){
        this.props.saveUserInfo(data);
        this.goToURL()
      }
    }).catch((errormsg) => {
      console.log("登录", errormsg);
    });
  }
  goToURL =() =>{
    const {userInfo:{Token}} = this.props;
    if(Token){
      const { query } = this.props.location;
      if(!query){
        return this.props.history.replace('/mine');
      }
      const { query:{ pathname } } = this.props.location;
      this.props.history.replace(pathname)  
    }
  }
  
  render() {
    const { mobile, verificationCode, isAccount, countDown } =this.state;
    return (
      <div className='account'>
        <ul className='account_box'>
          <li className='account_item'>
            <input className='item_mobile' 
              onChange={(e)=>{this.mobileChange(e)}} 
              value={mobile} 
              placeholder="请输入手机号" 
              type='number' />
            <button 
              className={classnames('item_code',(mobile.length === 11&&countDown>0) &&'countDown')} 
              onClick={()=>{this.getVerification()}}
            >{(!isAccount && countDown>0)?'获取验证码':`${countDown}s重新获取`}</button>
          </li>
          <li className='account_item'>
            <input 
              className='item_input' 
              onChange={(e)=>{this.codeChange(e)}} 
              value={verificationCode} 
              placeholder="请输入短信验证码" 
              type='number' 
            />
          </li>
        </ul>
        <button
          className={'account_login'} 
          type="submit" 
          onClick={()=>{this.loginBtn()}}
        >登录</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveUserInfo: (userInfo) => dispatch(saveUserInfo(userInfo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(account)