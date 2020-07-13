import React from 'react';
import * as ReactDOM from 'react-dom';
import { Fragment } from "react";
import { imgUrl } from '@/config'
import classNames from 'classnames'; 
import './toast.scss';
let timer = null;
let Times = 2000;

class Toast extends React.Component {
  static info(msg="info", timeout = Times) {
    init()
    setTime(timeout)
    ReactDOM.render(<Fragment>
        <span>{msg}</span>
      </Fragment>,
    document.getElementById('dark_toast'));
  }
  static success(msg = "success", timeout = Times) {
    init()
    setTime(timeout)
    ReactDOM.render(<Fragment>
      <div className='dark_center'>
        <img className={classNames("iconfont", "success")} src={`${imgUrl}icon/success.svg`} alt="icon"/>
        <span>{msg}</span>
      </div>
    </Fragment>, 
    document.getElementById('dark_toast'));
  }
  static fail(msg = "fail", timeout = Times) {
    init()
    setTime(timeout)
    ReactDOM.render(<Fragment>
      <img className={classNames("iconfont", "fail")} src={`${imgUrl}icon/fail.svg`} alt="icon"/>
      <span>{msg}</span>
    </Fragment>, 
    document.getElementById('dark_toast'));
  }
  static warning(msg = "warning", timeout = Times) {
    init()
    setTime(timeout)
    ReactDOM.render(<Fragment>
      <div className='dark_center'>
        <img className={classNames("iconfont", "warning")} src={`${imgUrl}icon/warning.svg`} alt="icon"/>
        <span>{msg}</span>
      </div>
    </Fragment>, 
    document.getElementById('dark_toast'));
  }
  static loading(msg = "loading", status = true) {
    init()
    setLoading(status)
    ReactDOM.render(<Fragment>
      <div className='dark_center'>
        <img className={classNames("iconfont", "loading")} src={`${imgUrl}icon/loading.svg`} alt="icon"/>
        <span>{msg}</span>
      </div>
    </Fragment>, 
    document.getElementById('dark_toast'));
  }
}
// 设置loading 显示隐藏
function setLoading(status) {
  let dark_toast = document.getElementById('dark_toast')
  if (status)
    dark_toast.style.display = "block"
  else
    dark_toast.style.display = "none"
}
// 初始化
function init () {
  clearTimeout(timer)
  let dark_toast = document.getElementById('dark_toast')
  if (dark_toast) {
    dark_toast.style.display = "block"
  } else {
    let div = document.createElement("div")
    div.setAttribute("id", "dark_toast")
    document.body.appendChild(div);
  }
}
// 倒计时控制 隐藏
function setTime (timeout) {
  timer = setTimeout (() => {
    let dark_toast = document.getElementById('dark_toast')
    if (dark_toast) {
      dark_toast.style.display = "none"
    }
  }, timeout)
}
export default Toast