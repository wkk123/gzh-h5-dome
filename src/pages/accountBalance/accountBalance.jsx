import React, { Component } from 'react'
import './accountBalance.scss';

export class accountBalance extends Component {
  // 余额充值
  balancePay = () =>{
    this.props.history.push('/balanceCharge')
  }
  render() {
    return (
      <div className='accountBalance_container'>
        <div className='accountBalance_box'>
          <div className='accountBalance_Balance'>
            <h6 className='Balance_Num'>66.00</h6>
            <h6 className='Balance_text'>账户余额(元)</h6>
          </div>
          <div className='accountBalance_btn'> 
            <button onClick={this.balancePay} type="submit" className='btn' >快速充值</button>
          </div>
        </div>
      </div>
    )
  }
}

export default accountBalance
