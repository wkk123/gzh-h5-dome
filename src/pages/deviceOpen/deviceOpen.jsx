import React, { Component } from 'react';
import { connect } from 'react-redux';
import { imgUrl } from '@/config';
import './deviceOpen.scss';
import { urlResolver } from '@/utils/commons';

function mapStateToProps(state) {
  return {

  };
}

class deviceOpen extends Component {
  state = {
    //交易详情
    info: {
      status: '',
      chargeMoney: '',
      DeviceNumber: '',
      DeviceWay: '',
      errmsg: '',
      TransId:'',
    },
    timeCount: 10,
  }
  componentDidMount(){
    console.log('this.props.location',this.props);
    this.setState({
      info: urlResolver(this.props.location.search),
    },()=>{
      const { timeCount } = this.state;
      this.countDown( timeCount );
    })
  }
  componentWillUnmount () {
    clearTimeout(this.timer)
  }
  // 立即查看 (详情)
  checkBtn = () =>{
    const { info:{ TransId } } = this.state;
    this.props.history.replace(`/chargeInfo?TransId=${TransId}`);
  }
  // 倒计时
  countDown = ( timeCount ) =>{
    const { info:{ status } } = this.state;
    if(status !== '1' && timeCount <= 0){ 
      this.props.history.replace('/home')
      return;
    };
    if( timeCount > 0 ){
      this.timer = setTimeout(() => {
        this.setState({
          timeCount: timeCount - 1
        },()=>{
          this.countDown( timeCount - 1 )
        })
      }, 1000);
    } else {
      const { info:{ TransId } } = this.state;
      this.props.history.replace(`/chargeInfo?TransId=${TransId}`);
    }
  }
  render() {
    const { info:{status, chargeMoney, DeviceNumber, DeviceWay, errmsg}, timeCount } = this.state;
    return (
      <div className='deviceOpen_container'>
        <div className='deviceOpen_box'>
          <ul className='deviceOpen_info'>
            <li className='info_item'>
              <img className='info_icon' src={ imgUrl +`icon/${status === '1'?'succeed':'failed'}.svg`} alt="info-icon"/>
            </li>
            <li className='info_item font20'>{status === '1'?'支付成功':'抱歉，支付失败了'}</li>
            <li className='info_item font16'>{status === '1'?`正在使用设备${DeviceNumber}，${DeviceWay}路充电站`:`${errmsg ?errmsg:'您的账户余额不足'}`}</li>
            <li className='info_item font16'>
              <p>
                {'金额'}
                <span className='font24 p10'>{`${chargeMoney}元`}</span>
              </p>
            </li>
            <li className='info_item font16'>{timeCount>0?`${ timeCount }s 后跳转至充电页面`:''}</li>
          </ul>
          <div className='deviceOpen_btn'>
            {(timeCount >0 && status === '1')&&<button
              className='btn_check'
              onClick={this.checkBtn}
              type="submit">立即查看</button>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(deviceOpen);