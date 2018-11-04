import React, { Component } from 'react'
import { Segment, Icon, Item, Button, List, Label } from 'semantic-ui-react';
import EventListAttendee from '../EventList/EventListAttendee';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { objectToArray } from '../../../app/common/util/helpers';

class EventListItem extends Component {


  render() {
    const { event } = this.props;
    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" circular src={event.hostPhotoURL} />
              <Item.Content>
                <Item.Header as={Link} to={'/event/' + event.id}>{event.title}</Item.Header>
                <Item.Description>
                  Hosted by <Link to={'/profile/' + event.hostUid}>{event.hostedBy}</Link>
                </Item.Description>
                {event.cancelled &&
                  <Label style={{ top: '-40px' }} ribbon='right' color='red'>This event has been cancelled</Label>
                }
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment>
          <span>
            <Icon name="clock" />  {moment(event.date.toDate()).format('DD.MM.YYYY HH:mm')} |
            <Icon name="marker" /> {event.venue}
          </span>
        </Segment>
        <Segment secondary>
          <List horizontal>
            {event.attendees &&            
              objectToArray(event.attendees).map((attendee) => {
                return <EventListAttendee key={attendee.id} attendee={attendee} />
              })};
          </List>
        </Segment>
        <Segment clearing>
          <span>{event.description}</span>
          <Button as={Link} to={'/event/' + event.id} color="teal" floated="right" content="View" />
          {/* <Button onClick={deleteEvent(event.id)} as="a" color="red" floated="right" content="delete" /> */}
        </Segment>
      </Segment.Group>
    )
  }
}
export default EventListItem
