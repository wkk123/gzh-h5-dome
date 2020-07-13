import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { payModel, stateModel } from '@/utils/commons';
import './itemList.scss'

function mapStateToProps(state) {
  return {

  };
}

class itemList extends Component {
  static propTypes = {
    itemData: PropTypes.object.isRequired,
    itemFun: PropTypes.func.isRequired,
  }
  static defaultProps = {
    itemData: {},
  }
  state = {

  }
  render() {
    const { itemData:{Bao, CreateTime, Money, TransactionType, Ways} } = this.props;
    return (
      <div className='itemRecord' onClick={()=>this.props.itemFun()}>
        <div className='Record_info'>
          <h6 className='info_title'>{`${stateModel((Ways === 6 || Ways === 7)?Ways:TransactionType)}-${payModel(Ways)}`}</h6>
          <span className='info_time'>{CreateTime}</span>
        </div>
        <span className={classnames('Record_money',TransactionType !== 2 &&'active')}>{`${TransactionType === 2?'-':'+'}${(Money + Bao).toFixed(2)}`}</span>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(itemList);