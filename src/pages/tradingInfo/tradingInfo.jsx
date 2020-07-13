import React, { Component } from 'react';
import { connect } from 'react-redux';
import './tradingInfo.scss';
import { urlResolver, payModel, stateModel } from '@/utils/commons';

function mapStateToProps(state) {
  return {

  };
}
class tradingInfo extends Component {
  state = {
    infoData: {},//交易详情
  }
  componentDidMount(){
    this.setState({
      infoData: urlResolver(this.props.location.search)
    })
  }
  render() {
    const { infoData, infoData:{ Ways, TransactionType, Money, Bao, CreateTime, OrderNo } } = this.state;
    console.log(infoData);
    return (
      <div className='tradingInfo_container'>
        {infoData&&<div className='tradingInfo_box'>
          <div className='Info_money'>
            <h3 className='money_Num'>{`${true?'+':'-'}${(Number(Money) + Number(Bao)).toFixed(2)}`}</h3>
            <h6 className='money_explain'>{`支付${true?'成功':'失败'}`}</h6>
            <ul className='money_icon'>
              <li className='icon_left'></li>
              <li className='icon_right'></li>
            </ul>
          </div>
          <ul className='info_list'>
            <li className='list_item'>
              <span className='item_lable'>付款方式</span>
              <span className='item_word'>{payModel(Number(Ways))}</span>
            </li>
            <li className='list_item'>
              <span className='item_lable'>支付说明</span>
              <span className='item_word'>{stateModel(Number(Ways) === 6 || Number(Ways) === 7?Number(Ways):Number(TransactionType))}</span>
            </li>
            <li className='list_item'>
              <span className='item_lable'>交易时间</span>
              <span className='item_word'>{CreateTime}</span>
            </li>
            <li className='list_item'>
              <span className='item_lable'>订单编号</span>
              <div className='item_word'>{OrderNo}</div>
            </li>
          </ul>
        </div>}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(tradingInfo);