import React, { Component } from 'react';
import { connect } from 'react-redux';
import './tradinglist.scss';
import ItemList from './itemList/itemList'
import InfiniteScroll from 'react-infinite-scroller'
import { DefaultPage } from '@/components';
import { tradingRecord } from '@/api/api';
import { getUrlConcat } from '@/utils/commons';
import store from '@/store';

function mapStateToProps(state) {
  return {

  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

class tradinglist extends Component {
  state = {
    List:[],
    page: 1,//页数
    total: 0,
    hasMore: true, // 是否开启下拉加载
    ...store.getState()
  }
  componentDidMount(){
    const { isLogin } = this.state;
    if(isLogin){
      this.getList(1)
    }
  }
  getList(page=1){
    tradingRecord(page).then(({ success, data })=>{
      if(success){
        console.log('success,data ',success,data )
        const { List, page } = this.state;
        this.setState({
          List: [...List,...data.list],
          total: data.total,
          page: page+1,
        })
      }
    })
  }
  nextPageFun =()=>{
    const { page,  total, List } = this.state;
    if (total>=0 && List.length >= total) {
      return false
    }
    this.getList(page);
  }
  // 跳转交易记录详情
  itemInfo(item){
    this.props.history.push(`/tradingInfo${getUrlConcat(item)}`)
  }
  // 跳转登录
  loginfun =() =>{
    const { pathname } = this.props.location;
    this.props.history.push({pathname:'login', query:{ pathname:pathname }})
  }
  render() {
    const { List, hasMore } = this.state;
    return (
      <div className='list_box'>
        <InfiniteScroll
          initialLoad={true} // 不让它进入直接加载
          pageStart={1} // 设置初始化请求的页数
          loadMore={this.nextPageFun}  // 监听数据请求
          hasMore={hasMore} // 是否继续监听滚动事件 true 监听 | false 不再监听
          useWindow={false} // 不监听 window 滚动条
        >
          { List.length !== 0
            ? List.length !== 0 && List.map((item,index)=>
                <ItemList itemData={item} key={'id'+index} itemFun={this.itemInfo.bind(this,item)} />
              )
            : <DefaultPage />
          }
        </InfiniteScroll>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(tradinglist);