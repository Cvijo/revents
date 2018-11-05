import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedAbout from './UserDetailedAbout';
import UserDetailedPhoto from './UserDetailedPhoto';
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux'
import UserDetailedEvent from './UserDetailedEvent';
import { Grid } from 'semantic-ui-react';
import { userDetailedQuery } from '../userQueries';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { getUserEvents } from '../userActions';



class UserDetailedPage extends Component {

    async componentDidMount() {
       await this.props.getUserEvents(this.props.userUid);

    }

    changeTab = (e, data) => {
        this.props.getUserEvents(this.props.userUid, data.activeIndex);
    }

    render() {

        const loading = Object.values(this.props.requesting).some( a => a === true)
        if (loading){
            return <LoadingComponent inverted></LoadingComponent>
        }
        return (
            <div>
                <Grid>
                    <UserDetailedHeader profile={this.props.profile}></UserDetailedHeader>
                    <UserDetailedAbout profile={this.props.profile}></UserDetailedAbout>
                    <UserDetailedPhoto photos={this.props.photos}></UserDetailedPhoto>
                    <UserDetailedEvent events={this.props.events} eventsLoading = {this.props.eventsLoading} changeTab={this.changeTab}></UserDetailedEvent>
                </Grid>

            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {

    let userUid = null;
    let profile = {};
    if( ownProps.match.params.id === state.auth.id) {
        profile = state.firebase.profile
    } else {
        profile = !isEmpty(state.firestore.ordered.profile) && state.firestore.ordered.profile[0]
        userUid = ownProps.match.params.id;
    }

    return {
        userUid,
        auth: state.firebase.auth,
        profile,
        eventsLoading: state.async.loading,
        events: state.events,
        photos: state.firestore.ordered.photos,
        requesting: state.firestore.status.requesting
    }
}

const actions =  {
    getUserEvents
}


export default compose(
    connect(mapStateToProps, actions),
    firestoreConnect((auth, userUid) => userDetailedQuery(auth, userUid))
)(UserDetailedPage);

/*
class UserDetailedPage extends Component {

    render() {

        return (
            <Grid>
                <Grid.Column width={16}>
                    <Segment>
                        <Item.Group>
                            <Item>
                                <Item.Image avatar size='small' src='https://randomuser.me/api/portraits/men/20.jpg'/>
                                <Item.Content verticalAlign='bottom'>
                                    <Header as='h1'>First Name</Header>
                                    <br/>
                                    <Header as='h3'>Occupation</Header>
                                    <br/>
                                    <Header as='h3'>27, Lives in London, UK</Header>
                                </Item.Content>
                            </Item>
                        </Item.Group>

                    </Segment>
                </Grid.Column>
                <Grid.Column width={12}>
                    <Segment>
                        <Grid columns={2}>
                            <Grid.Column width={10}>
                                <Header icon='smile' content='About Display Name'/>
                                <p>I am a: <strong>Occupation Placeholder</strong></p>
                                <p>Originally from <strong>United Kingdom</strong></p>
                                <p>Member Since: <strong>28th March 2018</strong></p>
                                <p>Description of user</p>

                            </Grid.Column>
                            <Grid.Column width={6}>

                                <Header icon='heart outline' content='Interests'/>
                                <List>
                                    <Item>
                                        <Icon name='heart'/>
                                        <Item.Content>Interest 1</Item.Content>
                                    </Item>
                                    <Item>
                                        <Icon name='heart'/>
                                        <Item.Content>Interest 2</Item.Content>
                                    </Item>
                                    <Item>
                                        <Icon name='heart'/>
                                        <Item.Content>Interest 3</Item.Content>
                                    </Item>
                                </List>
                            </Grid.Column>
                        </Grid>

                    </Segment>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Segment>
                        <Button color='teal' fluid basic content='Edit Profile'/>
                    </Segment>
                </Grid.Column>

                <Grid.Column width={12}>
                    <Segment attached>
                        <Header icon='image' content='Photos'/>
                        
                        <Image.Group size='small'>
                            <Image src='https://randomuser.me/api/portraits/men/20.jpg'/>
                            <Image src='https://randomuser.me/api/portraits/men/20.jpg'/>
                            <Image src='https://randomuser.me/api/portraits/men/20.jpg'/>
                            <Image src='https://randomuser.me/api/portraits/men/20.jpg'/>
                        </Image.Group>
                    </Segment>
                </Grid.Column>

                <Grid.Column width={12}>
                    <Segment attached>
                        <Header icon='calendar' content='Events'/>
                        <Menu secondary pointing>
                            <Menu.Item name='All Events' active/>
                            <Menu.Item name='Past Events'/>
                            <Menu.Item name='Future Events'/>
                            <Menu.Item name='Events Hosted'/>
                        </Menu>

                        <Card.Group itemsPerRow={5}>

                            <Card>
                                <Image src={'/assets/categoryImages/drinks.jpg'}/>
                                <Card.Content>
                                    <Card.Header textAlign='center'>
                                        Event Title
                                    </Card.Header>
                                    <Card.Meta textAlign='center'>
                                        28th March 2018 at 10:00 PM
                                    </Card.Meta>
                                </Card.Content>
                            </Card>

                            <Card>
                                <Image src={'/assets/categoryImages/drinks.jpg'}/>
                                <Card.Content>
                                    <Card.Header textAlign='center'>
                                        Event Title
                                    </Card.Header>
                                    <Card.Meta textAlign='center'>
                                        28th March 2018 at 10:00 PM
                                    </Card.Meta>
                                </Card.Content>
                            </Card>

                        </Card.Group>
                    </Segment>
                </Grid.Column>
            </Grid>

        );
    }
}

export default UserDetailedPage;
*/