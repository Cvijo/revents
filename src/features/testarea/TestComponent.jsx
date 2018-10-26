import React, { Component } from 'react'
import { connect } from 'react-redux';

class TestComponent extends Component {
  render() {
    return (
      <div>
        The answer is:{this.props.data}      
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  data: state.test.data
})
export default connect(mapStateToProps)(TestComponent)
