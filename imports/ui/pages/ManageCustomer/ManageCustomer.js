import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, ControlLabel, Row, Col, Button, FormGroup } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import Customers from '../../../api/Customers/Customers';
import validate from '../../../modules/validate';
import CustomerForm from '../../components/CustomerForm/CustomerForm';

class ManageCustomer extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {};
    // this.thing = this.thing.bind(this);
  }

  componentDidMount() {
  	const component = this;
  	validate(this.wifiForm, {
  		rules: {
  			ssidOne: {
  				required: true,
  			},
  			securityKeyOne: {
  				required: true,
  			},
  		},
  		messages: {
  			ssidOne: {
  				required: 'SSID #1 is required.',
  			},
  			securityKeyOne: {
  				required: 'What\'s the security key for SSID #1?',
  			},
  		},
  		submitHandler() {
  			// Meteor.call('', {}, (error, response) => {
  			//   if (error) {
  			//     Bert.alert(error.reason, 'danger');
  			//   } else {
  			//     Bert.alert('', 'success');
  			//   }
  			// });
  		},
  	});
  }

  render() {
  	const { loading, customer } = this.props;
    return !loading ? (<div className="ManageCustomer">
      <h3>{customer.name}</h3>

      <Tabs animation={false}>
		  <Tab eventKey="customer" title="Customer">
		    <CustomerForm customer={customer} />
		  </Tab>


      	<Tab eventKey="wifi" title="Wi-Fi">
      		<form ref={wifiForm => (this.wifiForm = wifiForm)} onSubmit={(event) => event.preventDefault()}>
				<h4 className="page-header">SSID #1</h4>
	      		<Row>
	      			<Col xs={6}>
	      				<ControlLabel>SSID</ControlLabel>
	      				<input
	      					type="text"
	      					name="ssidOne"
	      					ref={ssidOne => (this.ssidOne = ssidOne)}
	      					className="form-control"
	      					placeholder="Wi-Fi SSID"
	      				/>
	      			</Col>
	      			<Col xs={6}>
								<ControlLabel>Security Key</ControlLabel>
								<input
	      					type="text"
	      					name="securityKeyOne"
	      					ref={securityKeyOne => (this.securityKeyOne = securityKeyOne)}
	      					className="form-control"
	      					placeholder="Security Key"
	      				/>
	      			</Col>
	      		</Row>
	      		<h4 className="page-header">SSID #2</h4>
	      		<Row>
	      			<Col xs={6}>
	      				<ControlLabel>SSID</ControlLabel>
	      				<input
	      					type="text"
	      					name="ssidTwo"
	      					ref={ssidTwo => (this.ssidTwo = ssidTwo)}
	      					className="form-control"
	      					placeholder="Wi-Fi SSID"
	      				/>
	      			</Col>
	      			<Col xs={6}>
								<ControlLabel>Security Key</ControlLabel>
								<input
	      					type="text"
	      					name="securityKeyTwo"
	      					ref={securityKeyTwo => (this.securityKeyTwo = securityKeyTwo)}
	      					className="form-control"
	      					placeholder="Security Key"
	      				/>
	      			</Col>
	      		</Row>
	      		<h4 className="page-header">SSID #3</h4>
	      		<Row>
	      			<Col xs={6}>
	      				<FormGroup>
		      				<ControlLabel>SSID</ControlLabel>
		      				<input
		      					type="text"
		      					name="ssidThree"
		      					ref={ssidThree => (this.ssidThree = ssidThree)}
		      					className="form-control"
		      					placeholder="Wi-Fi SSID"
		      				/>
		      			</FormGroup>
	      			</Col>
	      			<Col xs={6}>
								<FormGroup>
									<ControlLabel>Security Key</ControlLabel>
									<input
		      					type="text"
		      					name="securityKeyThree"
		      					ref={securityKeyThree => (this.securityKeyThree = securityKeyThree)}
		      					className="form-control"
		      					placeholder="Security Key"
		      				/>
		      			</FormGroup>
	      			</Col>
	      		</Row>
	      		<Button type="submit" bsStyle="success">Save</Button>
      		</form>
      	</Tab>

		  <Tab eventKey="exportData" title="Data">
			  <form ref={editExportData => (this.editExportData = editExportData)} onSubmit={(event) => event.preventDefault()}>
			  <h4 className="page-header">Data Delivery Method</h4>
			  <FormGroup>

				  <Row>
					  <Col xs={2}>
						  <ControlLabel>Connection Type</ControlLabel>(HTTP, WebSocket, MQTT)
				  <input
					  type="text"
					  name="connectionType"
					  ref={connectionType => (this.connectionType = connectionType)}
					  className="form-control"
					  placeholder="Connection Type"
				  />
						  </Col>
					  </Row>

				  <Row>
					  <Col xs={4}>
						  <ControlLabel>Host</ControlLabel>
						  <input
							  type="text"
							  name="connectionHost"
							  ref={connectionHost => (this.connectionHost = connectionHost)}
							  className="form-control"
							  placeholder="Host"
						  />
					  </Col>
					  <Col xs={4}>
						  <ControlLabel>Port</ControlLabel>
						  <input
							  type="text"
							  name="connectionPort"
							  ref={connectionPort => (this.connectionPort = connectionPort)}
							  className="form-control"
							  placeholder="Port"
						  />
					  </Col>
					  <Col xs={4}>
						  <ControlLabel>Topic</ControlLabel>
						  <input
							  type="text"
							  name="connectionTopic"
							  ref={connectionTopic => (this.connectionTopic = connectionTopic)}
							  className="form-control"
							  placeholder="Topic"
						  />
					  </Col>
				  </Row>
				  <Row>
					  <Col xs={4}>
						  <ControlLabel>Username (optional)</ControlLabel>
						  <input
							  type="text"
							  name="connectionUsername"
							  ref={mqttUsername => (this.mqttUsername = mqttUsername)}
							  className="form-control"
							  placeholder="Username"
						  />
					  </Col>
					  <Col xs={4}>
						  <ControlLabel>Password (optional)</ControlLabel>
						  <input
							  type="text"
							  name="connectionPassword"
							  ref={connectionPassword => (this.connectionPassword = connectionPassword)}
							  className="form-control"
							  placeholder="Password"
						  />
					  </Col>
				  </Row>

			  </FormGroup>
			  <Button type="submit" bsStyle="success">Save</Button>
		  </form>

		  </Tab>


		  <Tab eventKey="readers" title="Readers">
			  <h4 className="page-header">Readers Details</h4>
			  <p>Need a way to add readers manually, one at a time would be fine.</p>
			  <p>Need to be able to import Readers from a CSV file (select file dialog)</p>
			  <p>-------------------------------------------</p>
			  <p>Serial Number</p>
			  <p>MAC Address</p>
			  <p>Last Event Received</p>
			  <p>-------------------------------------------</p>
			  <p>We already have a collection of all readers, however this view only shows readers owned by the customer </p>
			  <p>Search - Reader Serial Number - auto-filter</p>
		  </Tab>


		  <Tab eventKey="beacons" title="Beacons">
			  <h4 className="page-header">Beacons Details</h4>
			  <p>Type - Dropdown</p>
			  <p>MAC Address</p>
			  <p>Last Seen Date/Time</p>
			  <p>Reader Serial Number</p>

			  <p>-------------------------------------------</p>
			  <p>We already have a collection of all beacons, however this view only shows beacons owned/monitored by the customer </p>
			  <p>Select Type to filter</p>
			  <p>Search - Beacon MAC Address</p>
			  <p>Search - Reader Serial Number</p>
		  </Tab>


	  </Tabs>
    </div>) : 'Loading...'; // <div /> if you want an empty/blank page while loading.
  }
}

ManageCustomer.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default withTracker(({ match }) => {
	const customerId = match.params._id;
  const subscription = Meteor.subscribe('customers.manage', customerId);
  return {
    loading: !subscription.ready(),
    customer: Customers.findOne({ _id: customerId }),
  };
})(ManageCustomer);
