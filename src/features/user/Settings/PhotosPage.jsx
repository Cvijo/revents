import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux'
import { Image, Segment, Header, Divider, Grid, Button, Card, Icon } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { uploadProfileImage, deletePhoto, setMainPhoto } from '../userActions';

import { toastr } from 'react-redux-toastr';


const query = ({auth}) => {
  const qry =  [
    {
      collection: 'users',
      doc: auth.uid,
      subcollections: [{ collection: 'photos' }],
      storeAs: 'photos'
    }
  ]
  return qry
}

class PhotosPage extends Component {
  constructor(props) {
    super(props);
    this.cropperRef = React.createRef();

  }
 
  state = {
    files: [],
    fileName: '',
    cropResult: null,
    image: {}
  }
  
  handlePhotoDelete = (photo) => async () => {
    try {
      this.props.deletePhoto(photo);
    } catch(error) {
      toastr.error("Oops", error.message);
    }
    
  }

  handleSetMailPhoto = (photo) => async() =>{
    try {
      this.props.setMainPhoto(photo);
    } catch(error) {
      toastr.error("Oops", error.message);
    }
  }

  uploadImage = async () => {
    try {
      await this.props.uploadProfileImage(this.state.image, this.state.fileName);
      this.cancelCrop();
      toastr.success('Success', 'Photo has been uploaded.')
    } catch (error) {
      toastr.error('Opps', error.message)
    }
  }

  cancelCrop = () => {
    this.setState({
      files: [],
      image: {}
    })
  }

  cropImage = () => {
    if (typeof this.cropperRef.current.getCroppedCanvas() === 'undefined') {
      return
    }
    this.cropperRef.current.getCroppedCanvas().toBlob(blob => {
      let imageUrl = URL.createObjectURL(blob);
      this.setState({
        cropResult: imageUrl,
        image: blob
      })
    }, 'image/jpeg')
  }


  onDrop = (files) => {
    this.setState({
      files,
      fileName: files[0].name
    })
  }

  render() {    
    const {photos, profile, loading} = this.props
    let filteredPhotos;
    if( photos ) {
      filteredPhotos = photos.filter(photo => {
        return photo.url !== profile.photoURL
      })
    }

    return (
      <Segment>
        <Header dividing size='large' content='Your Photos' />
        <Grid>
          <Grid.Row />
          <Grid.Column width={4}>
            <Header color='teal' sub content='Step 1 - Add Photo' />
            <Dropzone onDrop={this.onDrop} multiple={false}>
              <div style={{ paddingTop: '30px', textAlign: "center" }}>
                <Icon name='upload' size='huge'></Icon>
                <Header content='Drop image here or click to add' />
              </div>
            </Dropzone>
          </Grid.Column>
          <Grid.Column width={1} />
          <Grid.Column width={4}>
            <Header sub color='teal' content='Step 2 - Resize image' />
            {this.state.files[0] &&
              <Cropper
                style={{ height: 200, width: '100%' }}
                // ref={ (ref) => this.cropper = ref}
                ref={this.cropperRef}
                src={this.state.files[0].preview}
                aspectRatio={1}
                dragMode='move'
                guides={false}
                scalable={true}
                cropBoxMovable={true}
                cropBoxResizable={true}
                crop={this.cropImage}
              />
            }
          </Grid.Column>
          <Grid.Column width={1} />
          <Grid.Column width={4}>
            <Header sub color='teal' content='Step 3 - Preview and Upload' />
            {this.state.files[0] &&
              <div>
                <Image style={{ minHeight: '200px', minWidth: '200px' }} src={this.state.cropResult} />
                <Button.Group>
                  <Button loading={loading} onClick={this.uploadImage} style={{ width: '100px' }} positive icon='check'></Button>
                  <Button disabled={loading} onClick={this.cancelCrop} style={{ width: '100px' }} icon='close'></Button>
                </Button.Group>
              </div>
            }
          </Grid.Column>

        </Grid>

        <Divider />
        <Header sub color='teal' content='All Photos' />

        <Card.Group itemsPerRow={5}>
          <Card>
            <Image src={profile.photoURL || '/assets/user.png'} />
            <Button positive>Main Photo</Button>
          </Card>
          {photos && filteredPhotos.map( photo => (            
            <Card key={photo.id}>
            <Image
              src={photo.url}
            />
            <div className='ui two buttons'>
              <Button onClick={this.handleSetMailPhoto(photo)} basic color='green'>Main</Button>
              <Button onClick={this.handlePhotoDelete(photo)} basic icon='trash' color='red' />
            </div>
          </Card>
          ))}

        </Card.Group>
      </Segment>
    );
  }
}

const actions = {
  uploadProfileImage,
  deletePhoto,
  setMainPhoto
  
}

const mapStateToProps = (state) => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile, 
  photos: state.firestore.ordered.photos,
  loading: state.async.loading
});

export default compose(
  connect(mapStateToProps, actions),
  firestoreConnect(auth => query(auth))
)(PhotosPage);