import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { Popup } from 'react-weui';
import classnames from 'classnames';
import { imgUrl } from '@/config';

import './wayList.scss';

class wayList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  static propTypes = {
    List: PropTypes.array.isRequired, //列表内容
    isMoneyWay: PropTypes.bool.isRequired,//弹框显示隐藏
    wayItem: PropTypes.func.isRequired,//选择某一种支付方式
    isChecked:  PropTypes.number.isRequired,//默认支付方式
  }
  static defaultProps = {
    List:[
      {
        title:'微信支付',
        describe:'推荐已安装微信客户端的用户使用',
        icon: imgUrl+'icon/wx.png',
        type: 1,
      },
      {
        title:'账户余额',
        describe:'推荐您使用余额进行支付',
        icon: imgUrl+'icon/balance.png',
        type: 3,
      }
    ],
    isMoneyWay: false,
    isChecked: 3,
  }
  // 点击某一个
  wayItemBtn = (type) =>{
    this.setState({
      isChecked: type
    },()=>{
      this.props.wayItem(type);
    })
  }
  render () {
    const { List, isMoneyWay, isChecked } = this.props;
    return (
      <Popup
        show={isMoneyWay}
        onRequestClose={() =>this.props.wayItem(isChecked)}
      >
        <div className='way_popup'>
          <ul className='popup_hearde'>
            <li 
              className={classnames('hearde_tiem','goBack')} 
              onClick={() =>this.props.wayItem(isChecked)}
            ></li>
            <li className='hearde_title'>选择支付方式</li>
            <li className={classnames('hearde_tiem')}></li>
          </ul>
          <div className='popup_center'>
            <ul className='way_list'>
              {
                List.map((item,index)=>
                  <li className='list_item' key={'way'+index} onClick={() =>this.props.wayItem(item.type)}>
                    <div className='item_left'>
                      <img className='left_icon' src={item.icon} alt="icon"/>
                      <div className='left_info'>
                        <h6 className='info_title font3'>{item.title}</h6>
                        <p className='info_describe font9'>{item.describe}</p>
                      </div>
                    </div>
                    { List.length > 1 &&<img 
                      className='item_radio' 
                      src={imgUrl+`${isChecked === item.type?'icon/checked.png':'icon/unchecked.png'}`} 
                      alt="icon"/>}
                  </li>
                )
              }
            </ul>
          </div>
        </div>
      </Popup>
    )
  }
}

export default wayList