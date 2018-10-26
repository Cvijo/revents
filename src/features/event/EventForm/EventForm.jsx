import React, { Component } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { connect } from 'react-redux';
import { createEvent, updateEvent } from '../eventActions';
import cuid from 'cuid';



class EventForm extends Component {

    state = {
        event: Object.assign({}, this.props.event)
    }

    onInputChange = (evt) => {
        const newEvent = this.state.event;
        newEvent[evt.target.name] = evt.target.value;
        this.setState({ event: newEvent });
    };

    onFormSubmit = (evt) => {
        evt.preventDefault();
        if (this.state.event.id) {
            this.props.updateEvent(this.state.event);
            this.props.history.goBack();
        } else {
            const newEvent = {
                ...this.state.event,
                id: cuid(),
                hostPhotoURL: '/assets/user.png'
            }
            this.props.createEvent(newEvent);
            this.props.history.push('/events');
        }
    }

    render() {
        const { event } = this.state;
        return (
            <Segment>
                <Form onSubmit={this.onFormSubmit}>
                    <Form.Field>
                        <label>Event Title</label>
                        <input name='title' value={event.title} onChange={this.onInputChange} placeholder="Event title" />
                    </Form.Field>
                    <Form.Field>
                        <label>Event Date</label>
                        <input name='date' value={event.name} onChange={this.onInputChange} type="date" placeholder="Event Date" />
                    </Form.Field>
                    <Form.Field>
                        <label>City</label>
                        <input name='city' value={event.city} onChange={this.onInputChange} placeholder="City event is taking place" />
                    </Form.Field>
                    <Form.Field>
                        <label>Venue</label>
                        <input name='venue' value={event.venue} onChange={this.onInputChange} placeholder="Enter the Venue of the event" />
                    </Form.Field>
                    <Form.Field>
                        <label>Hosted By</label>
                        <input name='hostedBy' value={event.hostedBy} onChange={this.onInputChange} placeholder="Enter the name of person hosting" />
                    </Form.Field>
                    <Button positive type="submit">
                        Submit
          </Button>
                    <Button type="button" onClick={this.props.history.goBack} >Cancel</Button>
                </Form>
            </Segment>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const eventId = ownProps.match.params.id

    let event = {
        title: '',
        date: '',
        city: '',
        venue: '',
        hostedBy: ''    
    }

    if( eventId && state.events.length >0 ) {
        event = state.events.filter(event => eventId === event.id)[0];

        return {event};
    }
}

const actions = {
    createEvent, 
    updateEvent
}

export default connect(mapStateToProps, actions)(EventForm)