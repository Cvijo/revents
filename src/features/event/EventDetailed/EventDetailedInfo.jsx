import React, { Component } from 'react'
import { Segment, Grid, Icon, Button } from 'semantic-ui-react';
import EventDetailedMap from './EventDetailedMap';


class EventDetailedInfo extends Component {
  state = {
    showMap: false
  }

  showMapToggle = () => {
    this.setState(prevState => ({
      showMap: !prevState.showMap
    }))
  }
  event = this.props.event;
  

  render() {
    return (
      <Segment.Group>
        <Segment attached="top">
          <Grid>
            <Grid.Column width={1}>
              <Icon size="large" color="teal" name="info" />
            </Grid.Column>
            <Grid.Column width={15}>
              <p>{this.event.description}</p>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment attached>
          <Grid verticalAlign="middle">
            <Grid.Column width={1}>
              <Icon name="calendar" size="large" color="teal" />
            </Grid.Column>
            <Grid.Column width={15}>
              <span>{this.event.date}</span>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment attached>
          <Grid verticalAlign="middle">
            <Grid.Column width={1}>
              <Icon name="marker" size="large" color="teal" />
            </Grid.Column>
            <Grid.Column width={11}>
              <span>{this.event.venue}</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Button onClick={this.showMapToggle} color="teal" size="tiny" content={this.state.showMap ? "Hide Map" : "Show Map"} />
            </Grid.Column>
          </Grid>
        </Segment>
        {this.state.showMap &&
          <EventDetailedMap lat={this.event.venueLatLng.lat} lng={this.event.venueLatLng.lng} />
        }
      </Segment.Group>
    )
  }
}

export default EventDetailedInfo
