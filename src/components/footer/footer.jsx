import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'
import './footer.scss'

class Footer extends Component {
  render () {
    return (
      <section className='footer_container'>
        <NavLink className='guide_item' to='/home'>
          <div className='iconshouye icon-style'></div>
          <span className='spec_text'>首页</span>
        </NavLink>
        <NavLink className='guide_item' to='/record'>
          <div className='iconchongdianjilu icon-style'></div>
          <span className='spec_text'>充电记录</span>
        </NavLink>
        <NavLink className='guide_item' to='/mine'>
          <div className='iconwode icon-style'></div>
          <span className='spec_text'>我的</span>
        </NavLink>
      </section>  
    )
  }
}

export default Footer