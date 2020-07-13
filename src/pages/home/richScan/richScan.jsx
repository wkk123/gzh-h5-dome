import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { imgUrl } from '@/config';
import './richScan.scss';

class richScan extends Component {
  static propTypes = {
    inputNumber: PropTypes.func.isRequired,
    scanQRCodeBtn:PropTypes.func.isRequired,
  }
  render () {
    return (
      <div className='richScan_container'>
        <button 
          className='richScan_btn'
          onClick={()=>{this.props.scanQRCodeBtn()}}
        >
          <img className='btn_img' src={imgUrl+'module/code1.svg'} alt="richScan"/>
          <span className='btn_text'>扫码充电</span>
        </button>
        <button 
          className='richScan_text'
          onClick={()=>{this.props.inputNumber()}}
        >输入设备编码</button>
      </div>
    )
  }
}

export default richScan