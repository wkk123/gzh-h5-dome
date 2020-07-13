import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { goToModule } from '@/utils/commons';
import classnames from 'classnames';
import './card.scss';

class card extends Component {
  constructor(props) {
    super(props);
    this.state ={

    }
  }
  static propTypes = {
    cardList: PropTypes.array.isRequired,
  }
  static defaultProps = {
    cardList:[],
  }
  componentDidMount() {

  }
  // 跳转公用页面
  GotoPage =(item)=>{
    if(item.type ==='h5'){
      goToModule(item.pathname);
    }
  }
  render () {
    const { cardList } = this.props;
    return (
      <ul className={classnames('card_list', cardList.length !==0 &&'default')}>
        {cardList.length >0 && cardList.map((item, index) =>
          <Link to={{ pathname: item.type==='gzh'?item.pathname:'' }} style={{width:`${100/(cardList.length > 5 ? 5 : cardList.length)}%`}} key={'id'+index} className="list_item">
            <li className='item_box' onClick={()=>{ this.GotoPage(item)}}>
              <img src={item.icon} alt={item.title} className="item_icon"/>
              <span className="item_spac">{item.title}</span>
            </li>
          </Link>
        )}
      </ul>
    )
  }
}

export default card