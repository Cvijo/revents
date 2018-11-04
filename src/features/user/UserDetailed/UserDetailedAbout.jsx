import React from 'react'
import { Grid, Header, Item, Segment, Icon, List } from "semantic-ui-react";
import moment from 'moment';

function UserDetailedAbout(props) {
    const { profile } = props

    let interests = (<Item>{'No interests'}</Item>)
    if (profile.interests && profile.interests.length > 0) {
        interests = profile.interests.map(item => {
            return (
                <Item key={item}>
                    <Icon name='heart' />
                    <Item.Content>{item}</Item.Content>
                </Item>
            );
        });
    }

    return (
        <Grid.Column width={12}>
            <Segment>
                <Grid column={2}>
                    <Grid.Column width={10}>
                        <Header icon="smile" content={"About " + profile.displayName}></Header>
                        <p>I am a: <strong>{profile.occupation || 'tbn'}</strong></p>
                        <p>Originally from: <strong>{profile.origin || 'tbn'}</strong></p>
                        <p>Member since: <strong>{moment(profile.createdAt, 'X').format("DD.MM.YYYY")}</strong></p>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Header icon="heart outline" content='Interests'></Header>
                        <List>
                            {interests}
                        </List>
                    </Grid.Column>
                </Grid>
            </Segment>
        </Grid.Column>
    )
}


export default UserDetailedAbout

