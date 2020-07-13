import React, {Component} from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames';
import './moneyList.scss';

class moneyList extends Component {
  constructor(props) {
    super(props);
    this.state={

    }
  }
  static propTypes = {
    List: PropTypes.array.isRequired, //列表内容
    itemMoney: PropTypes.func.isRequired,//点击某一个金额端口
    userDefined: PropTypes.number.isRequired,//默认金额
    moneyIndex: PropTypes.number.isRequired,//默认
  }
  static defaultProps = {
    List: [1,2,3,4,5,6],
    userDefined: 0,
    moneyIndex: -1
  }
  render () {
    const { List, userDefined, moneyIndex } = this.props;
    return (
      <ul className='money_list'>
        {
          List.map((item,index)=>
            <li className={classnames('list_item', moneyIndex === index&&'active')} 
              onClick={()=>{this.props.itemMoney(index!== 5?(Object.keys(item).length !== 0?item.money:item):0,index)}}
              key={'money'+index}
            >
              {
                `${(index === 5)?(userDefined?(userDefined+'元'):'自定义'):(Object.keys(item).length !== 0?item.money:item)+'元'}`
              }
            </li>
          )
        }
      </ul>
    )
  }
}

export default moneyList