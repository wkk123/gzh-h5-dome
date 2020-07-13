import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { imgUrl } from '@/config/index';
import classnames from 'classnames';
import store from '@/store';
import './list.scss';

class list extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...store.getState()
    };
  }
  static propTypes = {
    List: PropTypes.array.isRequired, //列表内容
    border: PropTypes.bool.isRequired, //是否显示边框
  }
  static defaultProps = {
    List: [],
    border: false,
  }
  render () {
    const { companyInfo:{ serviceTelephone } } = this.state;
    const { List, border } = this.props;
    return (
      <ul className='list_container'>
        {List&&List.map((item, index) =>
          item.pathname  !== 'phone'
          ? <Link to={{ pathname: item.pathname }} key={'id' + index} className={classnames("list_item", border&&"border")}>
              <li className='item_box'>
                <div className='item_left'>
                  <em  className={`icon-font icon${item.icon}`}></em>
                  <span className='left_text'>{item.title}</span>
                </div>
                <img className='icon' src={imgUrl+'icon/right.png'} alt="" />
              </li>
            </Link>
          : <a href={'tel:'+serviceTelephone} key={'id' + index} className={classnames("list_item", border&&"border")} >
              <li className='item_box'>
                <div className='item_left'>
                  <em  className={`icon-font icon${item.icon}`}></em>
                  <span className='left_text'>{item.title}</span>
                </div>
                <img className='icon' src={imgUrl+'icon/right.png'} alt="" />
              </li>
            </a>
        )}
      </ul>
    )
  }
}

export default list