import React, { Component } from 'react'
import { Grid, Loader } from 'semantic-ui-react';
import { firestoreConnect } from 'react-redux-firebase'
import EventList from '../EventList/EventList';
import { connect } from 'react-redux';
import { getEventsForDashboard, updateEvent, createEvent } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventActivity from '../../eventActivity/EventActivity';



const query = [
    {
        collection: 'activity',
        orderBy: ['timestamp', 'desc'],
        limit: 5
    }
]

class EventDashboard extends Component {
    state = {
        moreEvents: false,
        loadingInitial: true,
        loadedEvents: [],
        contextRef: {}
    }


    async componentDidMount() {
        let next = await this.props.getEventsForDashboard();
        if (next && next.docs && next.docs.length > 1) {
            this.setState({
                moreEvents: true,
                loadingInitial: false
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.events !== nextProps.events) {
            this.setState({
                loadedEvents: [...this.state.loadedEvents, ...nextProps.events]
            })
        }
    }
    getNextEvents = async () => {
        const { events } = this.props;
        let lastEvent = events && events[events.length - 1];
        let next = await this.props.getEventsForDashboard(lastEvent);
        if (next && next.docs && next.docs.length <= 1) {
            this.setState({
                moreEvents: false
            })
        }

    }

    handleContextRef = (aaaa) => this.setState({contextRef:aaaa});


    render() {
        if (this.state.loadingInitial) return <LoadingComponent inverted />
        return (
            <Grid>
                <Grid.Column width={10}>
                    <div ref={this.handleContextRef}>
                        <EventList
                            events={this.state.loadedEvents}
                            loading={this.props.loading}
                            moreEvents={this.state.moreEvents}
                            getNextEvents={this.getNextEvents}
                        />
                    </div>
                    {/* <Button loading={this.props.loading} onClick={this.getNextEvents} disabled={!this.state.moreEvents} content="More" color ='green' floated='right'></Button> */}
                </Grid.Column>
                <Grid.Column width={6}>
                    <EventActivity activities={this.props.activities} contextRef ={this.state.contextRef}></EventActivity>
                </Grid.Column>
                <Grid.Column width={10}>
                    <Loader active={this.props.loading}></Loader>
                </Grid.Column>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    events: state.events,
    loading: state.async.loading,
    activities: state.firestore.ordered.activity
})

const actions = {
    createEvent,
    getEventsForDashboard,
    updateEvent
}

export default connect(mapStateToProps, actions)(firestoreConnect(query)(EventDashboard));
