import React, {Component} from 'react';
import InfiniteScroll from 'react-infinite-scroller'
import { DefaultPage, Toast, Footer, RemoteCharge  } from '@/components';
import RecordItem from './recordItem/recordItem';
import store from '@/store';
import { getRecordList, cancelCharging, restartDevice } from '@/api/api'
import './record.scss';

class record extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordList:[],//充电记录
      page: 1,//页数
      hasMore: true,
      isRemote: false,
      parameter:{//远程续充参数
        Id:'', 
        DeviceNumber:'', 
        DeviceWay:''
      },
      ...store.getState()
    };
  }
  componentDidMount(){
    const { isLogin } = this.state;
    if(isLogin){
      this.getData(1)
    }
  }
  //获取充电列表
  getData(page=1){
    getRecordList(page).then(({ success, data })=>{
      if( success && data.length!==0 ){
        const { recordList, page } = this.state;
        this.setState({
          recordList: [...recordList,...data],
          page: page+1
        })
      }
    })
  }
  // 滚动加载
  nextPageFun =()=>{
    const { page } = this.state;
    this.getData(page);
  }
  // 跳转详情
  goToItemInfo = (status, Id)=> {
    if(status === 2) return;
    this.props.history.push(`/chargeInfo?TransId=${Id}`);
  }
  // 电瓶车点击按钮
  itemBtnBike = (status, data) => {
    const {  Id, DeviceNumber, DeviceWay } = data;
    if(status === 1) {
      this.cancelCharge(Id, DeviceNumber, DeviceWay)
    } else if(status === 2) {
      this.anewCharge(Id, DeviceNumber)
    } else if(status === 3) {
      this.setState({
        isRemote: true,
        parameter:{ Id, DeviceNumber, DeviceWay },
      })
    }
  }
  // 取消充电
  cancelCharge(TransId, DeviceNumber, DeviceWay){
    cancelCharging(TransId, DeviceNumber, DeviceWay).then(({success})=>{
      if(success){
        Toast.success('操作成功',1500,()=>{
          this.props.history.replace('/home')
        })
      }
    })
  }
  // 重新启动
  anewCharge(TransId, DeviceNumber){
    restartDevice(TransId, DeviceNumber).then(({success})=>{
      if(success){
        this.getData(1)
        Toast.success('操作成功')
      }
    })
  }
  // 远程续充输入金额弹框关闭
  Remoteitem = (Bool)=>{
    this.setState({
      isRemote: Bool,
    })
  }
  // 远程支付结果
  remoteResults = (status, TransId=null, errormsg = null)=>{
    if(status){
      this.getData(1)
      Toast.success('续充成功')
    } else if(errormsg){
      Toast.success(errormsg)
    }
    console.log('续充',TransId)
    this.setState({
      parameter:{
        Id:'', 
        DeviceNumber:'', 
        DeviceWay:''
      },
    })
  }
  // 跳转登录
  loginfun =() =>{
    const { pathname } = this.props.location;
    this.props.history.push({pathname:'login', query:{ pathname:pathname }})
  }

  render () {
    const { recordList, hasMore, isLogin, isRemote, parameter } = this.state;
    return (
      <div className='record_container'>
        <div className='record_list'>
          <InfiniteScroll
            initialLoad={false} // 不让它进入直接加载
            pageStart={1} // 设置初始化请求的页数
            loadMore={this.nextPageFun}  // 监听数据请求
            hasMore={hasMore} // 是否继续监听滚动事件 true 监听 | false 不再监听
            useWindow={false} // 不监听 window 滚动条
          >
            {
              (isLogin && recordList.length !== 0)
              ?recordList.length!==0&&recordList.map((item,index)=> 
                <div 
                  onClick={()=>{this.goToItemInfo(item.State,item.Id)}} 
                  key={'id'+index}
                  className='item_center'
                >
                  <RecordItem
                    itemBtn={ this.itemBtnBike}
                    itemData={item} 
                    isUnderway={item.State === 1} 
                  />
                </div>
              )
              :<DefaultPage />
            }
          </InfiniteScroll>
        </div>
        <RemoteCharge
          isRemote = {isRemote}
          parameter={parameter}
          RemoteFun={this.Remoteitem}
          remoteResults={this.remoteResults}
        />
        <Footer />
      </div>
    )
  }
}

export default record