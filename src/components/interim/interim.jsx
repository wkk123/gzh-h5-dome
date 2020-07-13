import React, {Component} from 'react'
import './interim.scss'

class interim extends Component {
  render () {
    return (
      <div className='loading_container'>
        <div className='loading'>
          <ul className="loading_box">
            <li className="load_item"></li>
            <li className="load_item"></li>
            <li className="load_item"></li>
            <li className="load_item"></li>
          </ul>
          <h6 className='loading_title'>加载中...</h6>
        </div>
      </div>
    )
  }
}

export default interim