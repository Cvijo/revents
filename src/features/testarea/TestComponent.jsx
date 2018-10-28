import React, { Component } from 'react'
import { connect } from 'react-redux';
import Script from 'react-load-script';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Button } from 'semantic-ui-react';
import { openModal } from '../modals/modalActions';




class TestComponent extends Component {

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  state = {
    address: '', 
    scriptLoaded: false
  }
  handleScriptLoad = () =>{
    this.setState({scriptLoaded:true});
  }
  handleFormSubmit = (event) => {
    event.preventDefault()

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error))
  }

  onChange = (address) => {
    this.setState({ address: address })
  }
  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
    }

 

    return (
      <div>
        <Script
          url='https://maps.googleapis.com/maps/api/js?key=AIzaSyA3cNoTEIEkKWfEMMfQhCH0pHKUO-fUv4w&libraries=places'
          onLoad={this.handleScriptLoad}
        />
        The answer is:{this.props.data}
        <br>
        </br>
        <form onSubmit={this.handleFormSubmit}>
         {this.state.scriptLoaded && <PlacesAutocomplete inputProps={inputProps} />   } 
          <button type="submit">Submit</button>
        </form>
        <br></br>
      
      <Button primary onClick={() => this.props.openModal('TestModal', null)}>Open test modal</Button>

      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  data: state.test.data
})

const actions={
  openModal
}
export default connect(mapStateToProps, actions)(TestComponent)






