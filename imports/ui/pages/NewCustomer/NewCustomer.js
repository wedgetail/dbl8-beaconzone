import React from 'react';
import PropTypes from 'prop-types';
import { ControlLabel, Button, FormGroup } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';

class NewCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    // this.thing = this.thing.bind(this);
    this.handleCreateNewCustomer = this.handleCreateNewCustomer.bind(this);
  }

  handleCreateNewCustomer() {
  	const customerName = this.customerName.value;
  	Meteor.call('customers.insert', customerName, (error, customerId) => {
  	  if (error) {
  	    Bert.alert(error.reason, 'danger');
  	  } else {
  	    Bert.alert('Customer created!', 'success');
        this.props.history.push(`/admin/customers/${customerId}`);
  	  }
  	});
  }

  componentDidMount() {
  	const component = this;

  	validate(this.newCustomerForm, {
  		rules: {
  			customerName: {
  				required: true,
  			},
  		},
  		messages: {
  			customerName: {
  				required: 'Need a name here.',
  			},
  		},
  		submitHandler() {
  			component.handleCreateNewCustomer();
  		},
  	});
  }

  render() {
    return (<div className="NewCustomer">
      <form ref={newCustomerForm => (this.newCustomerForm = newCustomerForm)} onSubmit={(event) => event.preventDefault()}>
        <FormGroup>
					<ControlLabel>Customer Name</ControlLabel>
	        <input
	        	className="form-control"
	        	name="customerName"
	        	ref={customerName => (this.customerName = customerName)}
	        />
	      </FormGroup>
	      <Button type="submit" bsStyle="success">Create Customer</Button>
      </form>
    </div>);
  }
}

NewCustomer.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default NewCustomer;
