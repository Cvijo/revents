import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import EventList from '../EventList/EventList';
import { connect } from 'react-redux';
import {deleteEvent, updateEvent, createEvent} from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventActivity from '../../eventActivity/EventActivity';






class EventDashboard extends Component {
       
    handleDeleteEvent = (eventId) => () => {
        this.props.deleteEvent(eventId);
    }

    render() {
        if( this.props.async.loading) return <LoadingComponent inverted="true" />
        return (
            <Grid>
                <Grid.Column width={10}>
                    <EventList deleteEvent = {this.handleDeleteEvent} events={this.props.events} />
                </Grid.Column>
                <Grid.Column width={6}>
                <EventActivity></EventActivity>
                </Grid.Column>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    events: state.events,
    async: state.async
})

const actions = {
    createEvent, 
    deleteEvent, 
    updateEvent
}

export default connect(mapStateToProps, actions)(EventDashboard);
