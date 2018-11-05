import React from 'react'
import { Grid, Header, Segment, Image } from "semantic-ui-react";
import LazyLoad from 'react-lazyload';


function UserDetailedPhoto(props) {
    if (!props.photos || props.photos.length === 0) { return null }

    return (
        <Grid.Column width={12}>
            <Segment>
                <Header icon='image' content='Photos' />
                <Image.Group size='small'>
                    {props.photos.map(photo => {
                        return (
                            <LazyLoad key={photo.id} height={150} placeholder={<Image src='/assets/user.png'></Image>}>
                                <Image src={photo.url}></Image>
                            </LazyLoad>
                        )
                    })}
                </Image.Group>
            </Segment>
        </Grid.Column>
    )
}

export default UserDetailedPhoto

