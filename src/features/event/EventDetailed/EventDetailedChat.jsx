import React, { Component } from 'react';
import { Segment, Header, Comment } from 'semantic-ui-react';
import EventDetailedChatForm from './EventDetailedChatForm';
import { Link } from 'react-router-dom';
import moment from 'moment';




class EventDetailedChat extends Component {
  state = {
    showReplyForm: false,
    selectedCommentId: null
  }
  
  handleOpenReplyForm = (id) => () => this.setState({showReplyForm:true, selectedCommentId: id});

  handleCloseReplyForm = () => this.setState({showReplyForm:false, selectedCommentId: null});

  render() {
    
    const { addEventComment, eventId, eventChat } = this.props;
    const {showReplyForm, selectedCommentId} = this.state;
    
    return (
      <div>
        <Segment
          textAlign="center"
          attached="top"
          inverted
          color="teal"
          style={{ border: 'none' }}
        >
          <Header>Chat about this event</Header>
        </Segment>
        <Segment attached>
          <Comment.Group>
            {eventChat && eventChat.map(comment => {
              return (
                <Comment key={comment.id}>
                  <Comment.Avatar src={comment.photoURL || "/assets/user.png"} />
                  <Comment.Content>
                    <Comment.Author as={Link} to={'/profile/' + comment.uid}>{comment.displayName}</Comment.Author>
                    <Comment.Metadata>
                      <div>{comment.date && moment(comment.date).fromNow()}</div>
                    </Comment.Metadata>
                    <Comment.Text>{comment.text}</Comment.Text>
                    <Comment.Actions>
                      <Comment.Action onClick={this.handleOpenReplyForm(comment.id)}>Reply</Comment.Action>
                      {showReplyForm && selectedCommentId === comment.id &&
                        <EventDetailedChatForm 
                          addEventComment={addEventComment} 
                          eventId={eventId} 
                          form={'reply_' + comment.id}
                          closeForm = {this.handleCloseReplyForm}
                          parentId = {comment.id}
                        />
                      }
                    </Comment.Actions>
                  </Comment.Content>
                </Comment>
              )
            })}
          </Comment.Group>
  
          <EventDetailedChatForm addEventComment={addEventComment} eventId={eventId} form={'newComment'} parentId = {0}></EventDetailedChatForm>
  
        </Segment>
      </div>
    );
  }
}

export default EventDetailedChat
