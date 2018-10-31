import React from 'react'
import { Grid } from 'semantic-ui-react';
import SettingsNav from './SettingsNav';
import { Switch, Route, Redirect } from 'react-router-dom';
import BasicPage from './BasicPage';
import AboutPage from './AboutPage';
import PhotosPage from './PhotosPage';
import AccountPage from './AccountPage';
import {connect} from 'react-redux'
import { updatePassword } from '../../auth/authActions';


const SettingsDashboard = (props) => {
  const {updatePassword, providerId} = props;
  
  return (
    <Grid>
      <Grid.Column width={12}>
        <Switch>
          <Redirect exact from='/settings' to='/settings/basic'/>
          <Route path='/settings/basic' component = {BasicPage} />
          <Route path='/settings/about' component = {AboutPage} />
          <Route path='/settings/photos' component = {PhotosPage} />
          <Route path='/settings/account' render = {() => <AccountPage updatePassword = {updatePassword} providerId={providerId} />}/>
        </Switch>
      </Grid.Column>
      <Grid.Column width={4}>
        <SettingsNav ></SettingsNav>
      </Grid.Column>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  providerId: state.firebase.auth.providerData[0].providerId
})

const actions = {
  updatePassword
}


export default connect(mapStateToProps, actions)(SettingsDashboard)
