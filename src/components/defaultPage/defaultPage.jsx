import React, {Component} from 'react';
import { imgUrl } from '@/config/index';
import store from '@/store';
import { Interim } from '@/components';
import PropTypes from 'prop-types';
import './defaultPage.scss';

class defaultPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInterim: true
    };
  }
  static propTypes = {
    loginBtn: PropTypes.func,
  }
  static defaultPage = {
    loginBtn: ()=>{},
  }
  componentDidMount() {
    const { isLogin } = store.getState();
    if(!isLogin){
      this.setState({
        isInterim: false
      })
      return
    }
    this.timer = setTimeout(()=>{
      this.setState({
        isInterim: false
      },()=>{
        clearTimeout(this.timer)
      })
    },1000)
  }
  componentWillUnmount () {
    clearTimeout(this.timer)
  }
  render () {
    const { isInterim } = this.state;
    const { isLogin } = store.getState();
    return (
      <div className='container'>
        { !isInterim
          ?<div className='center_box'>
            <img className='center_img' src={imgUrl+'noData/deal.png'} alt="" />
            <span className='center_describe'>{'暂无交易记录'}</span>
            {
              !isLogin&&<div className='center_btn'>
                <div className='btn_item'>暂不登录</div>
                <div className='btn_item' onClick={()=>{this.props.loginBtn()}}>立即登录</div>
              </div>
            }
          </div>
          :<Interim />
        }
      </div>
    )
  }
}

export default defaultPage