import React, { Component } from 'react';
import { OnlineCard } from '@/components';
import './myCardBag.scss';
import { userCardBag } from '@/api/api'


class myCardBag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      List:[],
    };
  }
  componentDidMount(){
    this.getList()
  }
  // 获取卡片列表
  getList(){
    userCardBag().then(({success,data})=>{
      if(success){
        this.setState({
          List:data
        })
      }
    })
  }
  // 去充值
  goRecharge = (a,b) =>{
    console.log('a,b',a,b);
    this.props.history.push('/buyCard')
  }
  // 查看范围
  CheckTheRange = (a,b) =>{
    console.log('a,b',a,b); 
  }
  render() {
    const { List } = this.state;
    return (
      <div className='myCard_container'>
        <div className='myCard_box'>
          <div className='myCard_item'>
            <h3 className='item_title'>线上卡</h3>
            <ul className='item_box'>
              { List.length !== 0
                ?List.map((item,index)=>
                  <OnlineCard
                    goTopUp = {this.goRecharge}
                    goMap = {this.CheckTheRange}
                    itemData = {item} 
                    key={'online'+index} 
                  />
                )
                : <li className='item_card'>
                  <div className='card_info info_noData'>
                    <span className='font20'>暂无线上卡</span>
                  </div>
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default myCardBag;