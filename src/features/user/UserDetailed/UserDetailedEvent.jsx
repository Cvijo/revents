import React from 'react'
import { Grid, Header, Image, Segment, Card, Menu, Tab } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const panes = [
    {menuItem: 'All Events', pane: {key:'allEvents'}},
    {menuItem: 'Past Events', pane: {key:'pastEvents'}},
    {menuItem: 'Future Events', pane: {key:'futureEvents'}},
    {menuItem: 'Hosted Events', pane: {key:'hostedEvents'}},
]



function UserDetailedEvent({ events, eventsLoading, changeTab }) {

    console.log(events);
    return (
        <Grid.Column width={12}>
            <Segment attached loading={eventsLoading}>
                <Header icon='calendar' content='Events' />
                <Tab onTabChange={(e, data) => changeTab(e,data)} panes={panes} menu={{secondary:true, pointing:true}}/>
                <br/>

                

                <Card.Group itemsPerRow={5}>
                    {events && events.map(event => {
                        return (
                        <Card as={Link} to={'/events/' + event.id} key={event.id}>
                            <Image src={'/assets/categoryImages/' + event.category + '.jpg'} />
                            <Card.Content>
                                <Card.Header textAlign='center'>
                                    {event.title}
                                </Card.Header>
                                <Card.Meta textAlign='center'>
                                    <div>{event.date && moment(event.date.toDate()).format('DD MMM YYYY')}</div>
                                    <div>{event.date && moment(event.date.toDate()).format('h:mm A')}</div>
                                </Card.Meta>
                            </Card.Content>
                        </Card>)
                    })}
                </Card.Group>
            </Segment>
        </Grid.Column>
    )
}


export default UserDetailedEvent

