import React, { Component } from 'react'
import { Menu, Container, Button } from 'semantic-ui-react'
import { NavLink, Link, withRouter } from 'react-router-dom';
import SignedOutMenu from '../Menus/SignedOutMenu';
import SignedInMenu from '../Menus/SignedInMenu';

class NavBar extends Component {

    state = {
        isAuth: false
    }

    handleSignIn = () => this.setState({ isAuth: true });
    handleSignOut = () => {
        this.setState({ isAuth: false })
        this.props.history.push('/');
    };


    render() {
        return (
            <Menu inverted fixed="top">
                <Container>
                    <Menu.Item as={Link} to='/' header>
                        <img src="/assets/logo.png" alt="logo" />
                        Re-vents
                    </Menu.Item>
                    <Menu.Item as={NavLink} to='/events' name="Events" />
                    {this.state.isAuth &&
                        <Menu.Item as={NavLink} to='/people' name="People" />}
                    {this.state.isAuth &&
                        <Menu.Item>
                            <Button as={Link} to='/createEvent' floated="right" positive inverted content="Create Event" />
                        </Menu.Item>}
                    {this.state.isAuth && <SignedInMenu signOut={this.handleSignOut} />}
                    {!this.state.isAuth && <SignedOutMenu signIn={this.handleSignIn} />}
                    <Menu.Item as={NavLink} to='/test' name="Test area" />
                </Container>
            </Menu>
        )
    }
}

export default withRouter(NavBar)