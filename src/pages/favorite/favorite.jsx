import React, { Component } from 'react';
import { collectionList, cancelCollect } from '@/api/api';
import { Toast, DefaultPage } from '@/components';
import InfiniteScroll from 'react-infinite-scroller'
import store from '@/store';

import './favorite.scss';

class favorite extends Component {
  state={
    List:[],//收藏列表
    total:0,
    page: 1,
    current: null,//当前
    hasMore: true, // 是否开启下拉加载
    ...store.getState()
  }
  componentDidMount() {
    const { isLogin } = this.state;
    if(isLogin){
      this.getList(1)
    }
  }
  // 获取收藏列表
  getList(page=1){
    collectionList(page).then(({success, data})=>{
      if(success){
        const { page, List } = this.state;
        this.setState({
          List: [...List, ...data.list],
          total: data.total,
          page: page+1,
        })
      }
    })
  }
  nextPageFun =()=>{
    const { page,  total, List } = this.state;
    console.log('total && page.length',total, List.length)
    if (total>=0 && (List.length >= total)) {
      return false
    } else{
      this.getList(page);
    }
  }
  // 取消收藏
  itemCancel =(id,index)=>{
    const { List } = this.state;
    cancelCollect(id).then(({ success })=>{
      if(success){
        Toast.success('取消收藏');
        delete List[index];
        this.setState({
          current: null,
          List: List,
        })
      }
    })
  }
  // 立即充电
  goToCharge =(deviceNumber)=>{
    this.props.history.push(`/deviceBoot?deviceNumber=${deviceNumber}`);
  }
  // 跳转登录
  loginfun =() =>{
    const { pathname } = this.props.location;
    this.props.history.push({pathname:'login', query:{ pathname:pathname }})
  }
  render() {
    const { List, current, hasMore } = this.state;
    return (
      <div className='favorite_container'
        onClick={()=>
          this.setState({
            current: null
          })
        }
      > 
        <div className='favorite_list'>
          <InfiniteScroll
            initialLoad={true} // 不让它进入直接加载
            pageStart={1} // 设置初始化请求的页数
            loadMore={this.nextPageFun}  // 监听数据请求
            hasMore={hasMore} // 是否继续监听滚动事件 true 监听 | false 不再监听
            useWindow={false} // 不监听 window 滚动条
          > 
            {(List.length !== 0)
              ?List.map((item,index) =>
                <div className='favorite_box' key={'favorite'+index}>
                  <div className="favorite_info" 
                    onClick={()=>
                      this.setState({
                        current: null
                      })
                    }
                  >
                    <div className='info_title'>
                      <h6 className='title'>{item.Name}</h6>
                      <div className='info_fav'>
                        <ul className="title_fav"
                          onClick={(e)=>{
                            e.stopPropagation();
                            this.setState({
                              current: item.Id
                            })}
                          }
                        >
                          {[1,2,3].map((indexs) =>
                            <li className="fav_item" key={'fav'+indexs}></li>
                          )}
                        </ul>
                        {
                          current === item.Id && <div className='fav_box'>
                            <div className='fav_info' onClick={()=>{this.itemCancel(item.Id,index)}}>取消收藏</div>
                          </div>
                        }
                      </div>
                    </div>
                    <h6 className='info_Address'>{item.InstallAddress}</h6>
                    {/* {item.IsBuy === 1&&<button className='info_online' type="submit">购买线上卡</button>} */}
                  </div>
                  <div className="favorite_btn" onClick={()=>{this.goToCharge(item.DeviceNumber)}}>立即充电</div>
                </div>)
              :<DefaultPage />  
            }  
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default favorite;