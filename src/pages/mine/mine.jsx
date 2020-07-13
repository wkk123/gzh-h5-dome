import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { imgUrl } from '@/config';
import { Card, List, Footer,  } from '@/components';
import store from '@/store';
import { phoneFormat } from '@/utils/commons';
import PropTypes from 'prop-types';
import { saveAcountData } from '@/store/actions';
import { acountInfo } from '@/api/api';
import './mine.scss';


class mine extends Component {
  static propTypes = {
    acountData: PropTypes.object.isRequired,
    saveAcountData: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      mineList: [
        { icon: 'kabao', title: '我的钱包', pathname: 'accountBalance', type: 'gzh' },
        { icon: 'jiaoyijilu', title: '联系客服', pathname: 'phone', type: 'gzh' },
        { icon: 'shezhi', title: '系统设置', pathname: 'system', type: 'gzh' },
      ],
      cardList: [
        { icon: imgUrl + 'module/5.svg', title: '我的卡包', pathname: 'myCardBag', type: 'gzh' },
        { icon: imgUrl + 'module/6.svg', title: '我的收藏', pathname: 'favorite', type: 'gzh' },
        { icon: imgUrl + 'module/2.svg', title: '交易记录', pathname: 'tradinglist', type: 'h5' },
      ],
      ...store.getState()
    };
  }
  componentDidMount() {
    const { isLogin } = this.state;
    if(isLogin){
      this.getAcountInfo();
    }
  }
  // 充值
  topUp =()=>{
    this.props.history.push('/accountBalance');
  }
  getAcountInfo(){
    acountInfo().then(({ success, data })=>{
      if(success){
        this.setState({
          acountData:data 
        })
        this.props.saveAcountData(data)
      }
    })
  }
  
  render() {
    const { userInfo:{ AvatarUrl, Moblie }, 
            acountData:{
              TotalCharge:{ TotalHour, TotalTimes },
              TotalAccount:{ AccountMoney, Bao }
            },
            mineList,
            cardList, 
            isLogin  
          } = this.state;

    return (
      <div className='mine_container'>
        <div className='mine_box'>
          <div className='min_info'>
            <div className='info_user'>
              <div className='user_box'>
                <img className='user_profile' src={AvatarUrl?AvatarUrl:`${imgUrl}mine/avtor.png`} alt="" />
                <div className='user_num'>
                  <h6 className='num_tel'>{isLogin?phoneFormat(Moblie):'未登录'}</h6>
                  <span className='num_money'><em className='num_unit'>￥</em>{isLogin&&(AccountMoney+Bao)?(AccountMoney+Bao).toFixed(2):0}</span>
                </div>
              </div>
              {
                isLogin
                  ? false&&<div className='balance_btn' onClick={this.topUp}>充值</div>
                  : <Link className='balance_btn' to={{ pathname: 'login', query:{pathname:'/mine'} }}>登录</Link>
              }
            </div>
            <ul className='info_charging'>
              <li className='charging_item'>
                <h6 className='item_num'>{isLogin&&TotalTimes?TotalTimes:0}</h6>
                <span className='item_description'>充电次数</span>
              </li>
              <li className='charging_item'>
                <h6 className='item_num'>{isLogin&&TotalHour?TotalHour:0}</h6>
                <span className='item_description'>累计时长(h)</span>
              </li>
            </ul>
          </div>
        </div>
        <Card cardList={cardList} />
        <List List={mineList} border={false} />
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    acountData: state.acountData
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveAcountData: (acountData) => dispatch(saveAcountData(acountData))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(mine)