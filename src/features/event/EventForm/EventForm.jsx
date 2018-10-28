/*global google*/
import React, { Component } from 'react'
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createEvent, updateEvent } from '../eventActions';
import cuid from 'cuid';
import { reduxForm, Field } from 'redux-form';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate';
import moment from 'moment';
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

		values.date = moment(values.date).format();
		values.venueLatLng = this.state.venueLatLng;
		if (this.props.initialValues.id) {
			this.props.updateEvent(values);
			this.props.history.goBack();
		} else {
			const newEvent = {
				...values,
				id: cuid(),
				hostPhotoURL: '/assets/user.png',
				hostedBy: 'Bob'
			}
			this.props.createEvent(newEvent);
			this.props.history.push('/events');
		}
	}
	handleSriptLoaded = () => this.setState({ scriptLoaded: true });

	render() {
		const { invalid, submitting, pristine } = this.props
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
							<Field name='date' type='text' component={DateInput} dateFormat='DD.MM.YYYY HH:mm' timeFormat='HH:mm' showTimeSelect placeholder='Date and Time of event' />
							<Button disabled={invalid || submitting || pristine} positive type="submit">
								Submit
							</Button>
							<Button type="button" onClick={this.props.history.goBack} >Cancel</Button>
						</Form>
					</Segment>
				</Grid.Column>
			</Grid>

		)
	}
}

const mapStateToProps = (state, ownProps) => {
	const eventId = ownProps.match.params.id

	let event = {}

	if (eventId && state.events.length > 0) {
		event = state.events.filter(event => eventId === event.id)[0];

	}
	return { initialValues: event }
}

const actions = {
	createEvent,
	updateEvent
}


export default connect(mapStateToProps, actions)(reduxForm({ form: 'eventForm', enableReinitialize: true, validate })(EventForm));