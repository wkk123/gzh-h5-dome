import React, {Component} from 'react'
import './battery.scss'

class battery extends Component {
  render () {
    return (
      <div className='battery_container'>
        <div className='battery_box'></div>
        <div className="ripple_box">
          <div className="ripple_item"></div>
          <div className="ripple_item"></div>
          <div className="ripple_item"></div>
        </div>
      </div>
    )
  }
}

export default battery