import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, ControlLabel, Row, Col, Button, FormGroup } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import Customers from '../../../api/Customers/Customers';
import validate from '../../../modules/validate';

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
      	<Tab eventKey="readers" title="Readers">
      		<p>Readers details</p>
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
