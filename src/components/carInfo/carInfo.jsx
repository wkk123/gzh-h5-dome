import React, { Component } from 'react';
import './carInfo.scss';

class carInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className='chargeInfo_box'>
        <div className='chargeInfo_info'>
          <div className='info_top'>
            <h6 className='font16'>{`设备编号：${107409}`}</h6>
            <h6 className='font16'>{`端口：${3}号`}</h6>
          </div>
          <div className='circle1'>
            <div className='info_circle'>
              <div className='circle_border active'>
                <div className='border_dot'></div>
              </div>
              <div className='circle_info'>
                <p className='font10'> 预充 <span className='font60'>8</span> 小时 </p>
                <span className='font10'>消费3.5元</span>
              </div> 
            </div>
          </div>
        </div>
        <ul className='info_list'>
          <li className='list_item'>
            <span className='item_lable'>设备名称</span>
            <span className='item_word'>{'111'}</span>
          </li>
          <li className='list_item'>
            <span className='item_lable'>开始时间</span>
            <span className='item_word'>{'111'}</span>
          </li>
          <li className='list_item'>
            <span className='item_lable'>已充时间</span>
            <span className='item_word'>{'111'}</span>
          </li>
          <li className='list_item'>
            <span className='item_lable'>设备地址</span>
            <span className='item_word'>{'111'}</span>
          </li>
          <li className='list_item'>
            <span className='item_lable'>订单编号</span>
            <span className='item_word'>{'111'}</span>
          </li>
          <li className='list_item'>
            <span className='item_lable'>计费方式</span>
            <span className='item_word'>{'111'}</span>
          </li>
          <li className='list_item font14'>
            <span className='item_lable'>第一档：</span>
            <span className='item_word'>{`${0}瓦 <${10}瓦，${20}分钟/元`}</span>
          </li>
          <li className='list_item font14'>
            <span className='item_lable'>第二档：</span>
            <span className='item_word'>{`${10}瓦 <${20}瓦，${20}分钟/元`}</span>
          </li>
          <li className='list_item font14'>
            <span className='item_lable'>第三档：</span>
            <span className='item_word'>{`${20}瓦 <${30}瓦，${20}分钟/元`}</span>
          </li>
        </ul>
        <div className='chargeInfo_btn'>
          <button className='btn_check' type="submit">重新启动</button>
          <button className='btn_check active' type="submit">取消充电</button>
          <button className='btn_check' type="submit">远程续充</button>
        </div>
      </div>
    );
  }
}


export default carInfo;