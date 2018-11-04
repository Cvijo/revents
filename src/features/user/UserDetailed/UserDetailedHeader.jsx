import React from 'react'
import { Grid, Header, Item, Segment } from "semantic-ui-react";
import moment from 'moment';

function UserDetailedHeader(props) {
    const { profile } = props
    const age = profile.dateOfBirth ? moment().diff(moment(profile.dateOfBirth, 'X'), 'years') : 'uknown age';

    return (
        <Grid.Column width={16}>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image circular size='small' src={profile.photoURL || '/assets/user.png'} />
                        <Item.Content verticalAlign="bottom">
                            <Header as='h1' content={profile.displayName} />
                            <br />
                            <Header as='h3' conetent={profile.occupation} />
                            <br />
                            <Header as='h3' content={age + ', Lives in ' + ( profile.city || 'unknown')} />
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
        </Grid.Column>
    )
}


export default UserDetailedHeader

