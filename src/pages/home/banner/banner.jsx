import React, {Component} from 'react';
// import {NavLink} from 'react-router-dom';
import {imgUrl} from '@/config';
import './banner.scss';

class Banner extends Component {
  render () {
    return (
      <div className='banner_container'>
        <img  className='banner_img' src={imgUrl+'home/banner.svg'} alt="banner"/>
      </div>
    )
  }
}

export default Banner