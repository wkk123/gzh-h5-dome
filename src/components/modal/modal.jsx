import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames';
import {Toast} from '@/components';
import './modal.scss'

class Modal extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,//input text

    title: PropTypes.string.isRequired,  // 弹框标题
    list: PropTypes.array.isRequired, //提示内容
    cancel: PropTypes.string.isRequired,//取消按钮文案
    confirm: PropTypes.string.isRequired,//确定按钮文案
    cancelBtn: PropTypes.func.isRequired,   // 关闭
    confirmBtn: PropTypes.func.isRequired,   // 退出

    inputType: PropTypes.string.isRequired,//number text
    placeholder: PropTypes.string.isRequired,
    maxLength: PropTypes.number.isRequired,

    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }
  static defaultProps = {
    title:'',
    type:'input',
    maxLength: 5,
    min: 0,//input 最小值
    max: 100,//input 最大值
    list:[
      {
        word:'',
        telephone:''
      }
    ],
    cancel: '',//取消文案
    confirm: '',//确定文案
    cancelBtn:() => {},//取消方法
    confirmBtn:() => {},//确定方法
    inputType:'text',
    placeholder:'',
  }
  state = {
    inputContent:'',//input 输入结果
  }
  // 取消
  handleCancel = () => {
    this.props.cancelBtn();
    this.setState({
      inputContent:''
    });
  }

  // 确定
  handleConfirm = () => {
    const { inputType, min, max, type, title, placeholder} = this.props;
    const { inputContent } = this.state;
    if(!inputContent&&type === 'input'){
      Toast.fail(placeholder?placeholder:title);
      return;
    }
    if (inputType === 'number'){
      let a = inputContent;
      if (Number(a)) {
        const reg1 = /0*([1-9]\d*|0\.\d+)/;//去掉小数点前多余的0
        const reg2 = /(?:\.0*|(\.\d+?)0+)$/;//去掉小数点后多余的0
        a = a.replace(reg1, '$1').replace(reg2, '$1');
        a = Number(a);
      } else {//非有效数字
        a = 0;
      }
      if (a < min) {
        a =   min;
      } else if (a > max){
        a = max;
      }
      this.props.confirmBtn(a);
    } else {
      this.props.confirmBtn(inputContent);
    }
    this.setState({
      inputContent: ''
    });
  }
  render () {
    const { type, title, list, cancel, confirm, placeholder, maxLength, inputType } = this.props;
    const { inputContent } = this.state;
    return (
      <div className='modal_container'>
        <div className='container_box'>
          {title&&<div className='modal_title'>{title}</div>}
          <div className={classnames('modal_content',!title&&'center')}>
            {(type === 'input')&&<input
              className='center_input'
              onChange={e => 
                this.setState({
                  inputContent: e.target.value
                })
              }
              placeholder={placeholder}
              value={inputContent} 
              maxLength={maxLength}
              type={inputType}
            />}
            {(type === 'text'&&list) && list.map((item,index)=>
              <div className='list_item' key={`id${index}`}>
                {item.word&&<span>{item.word}</span>}
                {item.telephone && <a className='item_phone' href={"tel:" + item.telephone}>{item.telephone}</a>}
              </div>
            )}
          </div>
          <div className='modal_btn'>
            {cancel && <button className='btn_item cancel' onClick={()=>{this.handleCancel()}} type="submit">{cancel}</button>}
            {confirm && <button className='btn_item confirm' 
              onClick={()=>{
                this.handleConfirm()
              }} 
              type="submit"
              >{confirm}</button>}
          </div>
        </div>
      </div>
    )
  }
}

export default Modal