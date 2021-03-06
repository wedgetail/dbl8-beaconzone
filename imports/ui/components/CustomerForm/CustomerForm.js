import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Row, Col, Button, InputGroup } from 'react-bootstrap';
import StateSelector from '../StateSelector/StateSelector';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import validate from '../../../modules/validate';

class CustomerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSendAdminInvite = this.handleSendAdminInvite.bind(this);
    this.generateApiKey = this.generateApiKey.bind(this);
  }

  componentDidMount() {
  	const component = this;
		validate(this.editCustomerForm, {
			rules: {
				eventViewerDashboardTimeout: {
					required: true,
				},
			},
			messages: {
				eventViewerDashboardTimeout: {
					required: 'An event viewer dashboard timeout is required.',
				},
			},
			submitHandler() { component.handleSubmit(); }
		});
  }

  handleSubmit() {
  	const customer = {
  		_id: this.props.customer._id,
  		name: this.customerName.value,
		  contact: this.customerContact.value,
		  address: this.customerAddress.value,
		  city: this.customerCity.value,
		  state: document.querySelector('[name="customerState"]').value,
		  zip: this.customerZip.value,
		  mobile: this.customerMobile.value,
		  telephone: this.customerTelephone.value,
			email: this.customerEmail.value,
			eventViewerDashboardTimeout: parseInt(this.eventViewerDashboardTimeout.value, 10),
      numberOfEventViewerUsers: parseInt(this.numberOfEventViewerUsers.value, 10),
  	};

  	Meteor.call('customers.update', customer, (error, response) => {
  	  if (error) {
  	    Bert.alert(error.reason, 'danger');
  	  } else {
  	    Bert.alert('Customer updated!', 'success');
  	  }
  	});
	}

	handleSendAdminInvite() {
    const { customer } = this.props;

    // Make sure we save the data before sending email in case the email changed.
    this.handleSubmit();

		if (customer.email) {
			Meteor.call('customers.inviteAdmin', customer._id, (error) => {
				if (error) {
					Bert.alert(error.reason, 'danger');
				} else {
					Bert.alert('Invite sent!', 'success');
				}
			});
		} else {
			Bert.alert('Please add an email address to the customer first.', 'danger');
		}
	}

  generateApiKey() {
    if (confirm('Are you sure? This will immediately disable the current key.')) {
      const { customer } = this.props;
      Meteor.call('customers.generateApiKey', customer._id, (error) => {
        if (error) {
          console.warn(error);
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('API key generated!', 'success');
        }
      });
    }
  }

  render() {
  	const { customer } = this.props;
    return (<div className="CustomerForm">
			<form ref={editCustomerForm => (this.editCustomerForm = editCustomerForm)} onSubmit={(event) => event.preventDefault()}>
			  <h4 className="page-header">Customer Contact Details</h4>
			  <Row>
			  	<Col xs={12} sm={5}>
			  	  <FormGroup>
						  <ControlLabel>Customer Name</ControlLabel>
						  <input
							  className="form-control"
							  name="customerName"
							  defaultValue={customer.name}
							  ref={customerName => (this.customerName = customerName)}
						  />
						</FormGroup>
			  	</Col>
			  	<Col xs={12} sm={3}>
			  	  <FormGroup>
						  <ControlLabel>Topic Code</ControlLabel>
						  <input
						    disabled
						    readOnly
							  className="form-control"
							  name="topicCode"
							  defaultValue={customer.topicCode}
							  ref={topicCode => (this.topicCode = topicCode)}
						  />
						</FormGroup>
			  	</Col>
          <Col xs={12} sm={4}>
            <FormGroup>
              <ControlLabel>API Key</ControlLabel>
              <InputGroup>
                <input
                  disabled
                  readOnly
                  className="form-control"
                  name="apiKey"
                  value={customer.apiKey || 'Not Set'}
                  ref={apiKey => (this.apiKey = apiKey)}
                />
                <InputGroup.Button>
                  <Button onClick={this.generateApiKey} bsStyle="default">Generate</Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
          </Col>
			  </Row>
			  <FormGroup>
				  <ControlLabel>Contact</ControlLabel>
				  <input
					  className="form-control"
					  name="customerContact"
					  defaultValue={customer.contact}
					  ref={customerContact => (this.customerContact = customerContact)}
					  className="form-control"
					  placeholder="Contact Name"
				  />

				  <ControlLabel>Address</ControlLabel>
				  <input
					  className="form-control"
					  name="customerAddress"
					  defaultValue={customer.address}
					  ref={customerAddress => (this.customerAddress = customerAddress)}
					  className="form-control"
					  placeholder="Address"
				  />
				  <Row>
					  <Col xs={4}>
						  <ControlLabel>City</ControlLabel>
						  <input
							  type="text"
							  name="customerCity"
							  defaultValue={customer.city}
							  ref={customerCity => (this.customerCity = customerCity)}
							  className="form-control"
							  placeholder="City"
						  />
					  </Col>
					  <Col xs={4}>
						  <ControlLabel>State</ControlLabel>
						  <StateSelector
						    name="customerState"
						    defaultValue={customer.state}
						  />
					  </Col>
					  <Col xs={4}>
						  <ControlLabel>Zip</ControlLabel>
						  <input
							  type="text"
							  name="customerZip"
							  defaultValue={customer.zip}
							  ref={customerZip => (this.customerZip = customerZip)}
							  className="form-control"
							  placeholder="Zip Code"
						  />
					  </Col>
				  </Row>
				  <Row>
					  <Col xs={4}>
						  <ControlLabel>Mobile</ControlLabel>
						  <input
							  type="text"
							  name="customerMobile"
							  defaultValue={customer.mobile}
							  ref={customerMobile => (this.customerMobile = customerMobile)}
							  className="form-control"
							  placeholder="Mobile"
						  />
					  </Col>
					  <Col xs={4}>
						  <ControlLabel>Telephone</ControlLabel>
						  <input
							  type="text"
							  name="customerTelephone"
							  defaultValue={customer.telephone}
							  ref={customerTelephone => (this.customerTelephone = customerTelephone)}
							  className="form-control"
							  placeholder="Telephone"
						  />
					  </Col>
				  </Row>
				  <Row>
					  <Col xs={4}>
						  <ControlLabel>Email</ControlLabel>
						  <input
							  type="text"
							  name="customerEmail"
							  defaultValue={customer.email}
							  ref={customerEmail => (this.customerEmail = customerEmail)}
							  className="form-control"
							  placeholder="Email"
						  />
					  </Col>
					  {customer.email ? <Col xs={3}>
							<Button type="button" style={{ marginTop: '24px' }} bsStyle="primary" onClick={this.handleSendAdminInvite}>Send Invite</Button>
					  </Col> : ''}
				  </Row>
			  </FormGroup>
				<Row>
					<Col xs={6}>
						<FormGroup>
							<ControlLabel>Event Viewer Dashboard Timeout (Seconds)</ControlLabel>
							<input
								type="number"
								name="eventViewerDashboardTimeout"
								defaultValue={customer.eventViewerDashboardTimeout}
								ref={eventViewerDashboardTimeout => (this.eventViewerDashboardTimeout = eventViewerDashboardTimeout)}
								className="form-control"
								placeholder="60"
							/>
						</FormGroup>
					</Col>
					<Col xs={6}>
						<FormGroup>
							<ControlLabel>Number of Event Viewer Users</ControlLabel>
							<input
								type="number"
								name="numberOfEventViewerUsers"
								defaultValue={customer.numberOfEventViewerUsers}
								ref={numberOfEventViewerUsers => (this.numberOfEventViewerUsers = numberOfEventViewerUsers)}
								className="form-control"
								placeholder="5"
							/>
						</FormGroup>
					</Col>
				</Row>
			  <Button type="submit" bsStyle="success">Save</Button>
		  </form>
    </div>);
  }
}

CustomerForm.propTypes = {
  customer: PropTypes.object.isRequired,
};

export default CustomerForm;
