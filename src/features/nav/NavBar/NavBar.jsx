import React, { Component } from 'react'
import {connect} from 'react-redux';
import { withFirebase } from 'react-redux-firebase'
import { Menu, Container, Button } from 'semantic-ui-react'
import { NavLink, Link, withRouter } from 'react-router-dom';
import SignedOutMenu from '../Menus/SignedOutMenu';
import SignedInMenu from '../Menus/SignedInMenu';
import { openModal } from '../../modals/modalActions';






class NavBar extends Component {


    handleSignIn = () => {this.props.openModal('LoginModal')};
    handleRegister = () => {this.props.openModal('RegisterModal')};
    handleSignOut = () => {
        this.props.firebase.logout();
        this.props.history.push('/');
    };


    render() {
        const {auth, profile} = this.props;
        const isAuth = auth.isLoaded && !auth.isEmpty
        return (
            <Menu inverted fixed="top">
                <Container>
                    <Menu.Item as={Link} to='/' header>
                        <img src="/assets/logo.png" alt="logo" />
                        Re-vents
                    </Menu.Item>
                    <Menu.Item as={NavLink} to='/events' name="Events" />
                    {isAuth &&
                        <Menu.Item as={NavLink} to='/people' name="People" />}
                    {isAuth &&
                        <Menu.Item>
                            <Button as={Link} to='/createEvent' floated="right" positive inverted content="Create Event" />
                        </Menu.Item>}
                    {isAuth && <SignedInMenu signOut={this.handleSignOut} profile = {profile} />}
                    {!isAuth && <SignedOutMenu signIn={this.handleSignIn} register={this.handleRegister} />}
                    <Menu.Item as={NavLink} to='/test' name="Test area" />
                </Container>
            </Menu>
        )
    }
}

const actions = {
    openModal
}

const mapStateToProps = (state) =>{
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}
export default withRouter(withFirebase( connect(mapStateToProps, actions)(NavBar)))