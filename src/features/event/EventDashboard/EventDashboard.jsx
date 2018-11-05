import React, { Component } from 'react'
import { Grid, Loader } from 'semantic-ui-react';
import { firestoreConnect } from 'react-redux-firebase'
import EventList from '../EventList/EventList';
import { connect } from 'react-redux';
import { getEventsForDashboard, updateEvent, createEvent } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventActivity from '../../eventActivity/EventActivity';


class EventDashboard extends Component {
    state = {
        moreEvents: false,
        loadingInitial: true,
        loadedEvents: []
    }


    async componentDidMount() {
        let next = await this.props.getEventsForDashboard();
        console.log(next);
        if (next && next.docs && next.docs.length > 1) {
            this.setState({
                moreEvents: true,
                loadingInitial: false
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if( this.props.events !== nextProps.events) {
            this.setState({
                loadedEvents: [...this.state.loadedEvents, ...nextProps.events]
            })
        }
    }
    getNextEvents = async () => {
        const { events } = this.props;
        let lastEvent = events && events[events.length - 1];
        console.log("lastEvent", lastEvent);
        let next = await this.props.getEventsForDashboard(lastEvent);
        if (next && next.docs && next.docs.length <= 1) {
            this.setState({
                moreEvents: false
            })
        }

    }

    render() {
        if (this.state.loadingInitial) return <LoadingComponent inverted/>
        return (
            <Grid>
                <Grid.Column width={10}>
                    <EventList 
                        events={this.state.loadedEvents} 
                        loading={this.props.loading} 
                        moreEvents={this.state.moreEvents}
                        getNextEvents = {this.getNextEvents}
                        />
                    {/* <Button loading={this.props.loading} onClick={this.getNextEvents} disabled={!this.state.moreEvents} content="More" color ='green' floated='right'></Button> */}
                </Grid.Column>
                <Grid.Column width={6}>
                    <EventActivity></EventActivity>
                </Grid.Column>
                <Grid.Column width={10}>
                    <Loader active ={this.props.loading}></Loader>
                </Grid.Column>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    events: state.events,
    loading: state.async.loading
})

const actions = {
    createEvent,
    getEventsForDashboard,
    updateEvent
}

export default connect(mapStateToProps, actions)(firestoreConnect([{ collection: 'events' }])(EventDashboard));
