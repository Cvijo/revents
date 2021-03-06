/*global google*/
import React, { Component } from 'react'
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createEvent, updateEvent, cancelToggle } from '../eventActions';
import { reduxForm, Field } from 'redux-form';
import {withFirestore} from 'react-redux-firebase';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate';
import PlaceInput from '../../../app/common/form/PlaceInput';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Script from 'react-load-script';



const category = [
	{ key: 'drinks', text: 'Drinks', value: 'drinks' },
	{ key: 'culture', text: 'Culture', value: 'culture' },
	{ key: 'film', text: 'Film', value: 'film' },
	{ key: 'food', text: 'Food', value: 'food' },
	{ key: 'music', text: 'Music', value: 'music' },
	{ key: 'travel', text: 'Travel', value: 'travel' },
];

const validate = combineValidators({
	title: isRequired({ message: 'The event title is required' }),
	category: isRequired({ message: 'Please provide a category' }),
	description: composeValidators(
		isRequired({ message: 'Please provide a description' }),
		hasLengthGreaterThan(4)({ message: 'Description has to be at least 5 characters' })
	)(),
	city: isRequired('city'),
	venue: isRequired('venue'),
	date: isRequired('date')
})

class EventForm extends Component {
	state = {
		cityLatLng: {},
		venueLatLng: {},
		scriptLoaded: false
	}

	async componentDidMount() {
		const{firestore, match} = this.props;
		await firestore.setListener('events/' + match.params.id);
	}

	async componentWillUnmount() {
		const{firestore, match} = this.props;
		await firestore.unsetListener('events/' + match.params.id);
	}

	handleCitySelect = (selectedCity) => {
		geocodeByAddress(selectedCity)
			.then(results => getLatLng(results[0]))
			.then(latLng => {
				this.setState({ cityLatLng: latLng })
			})
			.then(() => {
				this.props.change('city', selectedCity)  //mouse click fixed for places .. mouse didnt work on click
			})
	}

	handleVenueSelect = (selectedVenue) => {
		geocodeByAddress(selectedVenue)
			.then(results => getLatLng(results[0]))
			.then(latLng => {
				this.setState({ venueLatLng: latLng })
			})
			.then(() => {
				this.props.change('venue', selectedVenue)  //mouse click fixed for places .. mouse didnt work on click
			})
	}

	onFormSubmit = (values) => {
		values.venueLatLng = this.state.venueLatLng;
		if (this.props.initialValues.id) {
			if( Object.keys(values.venueLatLng).length === 0 ){
				values.venueLatLng = this.props.event.venueLatLng;
			}
			this.props.updateEvent(values);
			this.props.history.goBack();
		} else {
			this.props.createEvent(values);
			this.props.history.push('/events');
		}
	}
	handleSriptLoaded = () => this.setState({ scriptLoaded: true });

	render() {
		const { invalid, submitting, pristine, loading, event, cancelToggle } = this.props
		return (
			<Grid>
				<Script
					url='https://maps.googleapis.com/maps/api/js?key=AIzaSyA3cNoTEIEkKWfEMMfQhCH0pHKUO-fUv4w&libraries=places'
					onLoad={this.handleSriptLoaded}
				/>
				<Grid.Column width={10}>
					<Segment>
						<Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
							<Header sub color='teal' content='Event details' />
							<Field name='title' type='text' component={TextInput} placeholder='Give your event a name' />
							<Field name='category' type='text' component={SelectInput} options={category} placeholder='What is your event about' />
							<Field name='description' type='text' rows={3} component={TextArea} placeholder='Tell us about your event' />
							<Header sub color='teal' content='Event location details' />
							<Field name='city' type='text' component={PlaceInput} options={{ types: ['(cities)'] }} onSelect={this.handleCitySelect} placeholder='Event city' />
							{this.state.scriptLoaded &&
								<Field name='venue' type='text' component={PlaceInput} options={{ location: new google.maps.LatLng(this.state.cityLatLng), radius: 1000, types: ['establishment'] }} onSelect={this.handleVenueSelect} placeholder='Enter venue' />
							}
							<Field name='date' type='text' component={DateInput} dateFormat='YYYY-MM-DD HH:mm' timeFormat='HH:mm' showTimeSelect placeholder='Date and Time of event' />
							<Button loading = {loading} disabled={invalid || submitting || pristine} positive type="submit">
								Submit
							</Button>
							<Button type="button" onClick={this.props.history.goBack} >Cancel</Button>
							<Button 
							type="button" 
							floated='right' 
							color={event.cancelled ? 'green': 'red'} 
							content = {event.cancelled ? 'Reactivate event' : 'Cancel event'}
							onClick={() => cancelToggle(!event.cancelled, event.id)} />
						</Form>
					</Segment>
				</Grid.Column>
			</Grid>

		)
	}
}

const mapStateToProps = (state) => {

	let event = {};
	
	if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
		event = state.firestore.ordered.events[0];		
	}

	return { 
		initialValues: event,
		event,
		loading: state.async.loading
	}
}

const actions = {
	createEvent,
	updateEvent,
	cancelToggle
}


export default withFirestore(connect(mapStateToProps, actions)(reduxForm({ form: 'eventForm', enableReinitialize: true, validate })(EventForm)));