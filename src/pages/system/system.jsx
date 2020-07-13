import React, { Component } from 'react';
import { connect } from 'react-redux';
import './system.scss';
import { removeLocal } from '@/utils/commons';
import PropTypes from 'prop-types';
import { saveUserInfo } from '@/store/actions';


class system extends Component {
  static propTypes = {
    userInfo: PropTypes.object.isRequired,
    saveUserInfo: PropTypes.func.isRequired,
  }
  // 退出登录
  logoutBtn = () =>{
    removeLocal('userInfo');
    this.setState({
      userInfo:{}
    })
    this.props.saveUserInfo(
      {
        AvatarUrl:'',
        ExistPassWord:'',
        Moblie:'',
        Name:'',
        Token:'',
      }
    );
    this.props.history.goBack();
  }
  render() {
    return (
      <div className='system_container'>
        <div className='system_logOut' onClick={this.logoutBtn} >退出登录</div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo
  }
}
const  mapDispatchToProps = (dispatch) => {
  return {
    saveUserInfo: (userInfo) => dispatch(saveUserInfo(userInfo))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(system);