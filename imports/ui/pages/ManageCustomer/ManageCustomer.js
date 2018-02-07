import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, ControlLabel, Row, Col, Button, FormGroup } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import Customers from '../../../api/Customers/Customers';
import CustomerForm from '../../components/CustomerForm/CustomerForm';
import CustomerWifiForm from '../../components/CustomerWifiForm/CustomerWifiForm';
import CustomerDataForm from '../../components/CustomerDataForm/CustomerDataForm';
import CustomerReaderForm from '../../components/CustomerReaderForm/CustomerReaderForm';
import CustomerBeaconForm from '../../components/CustomerBeaconForm/CustomerBeaconForm';

class ManageCustomer extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {};
    // this.thing = this.thing.bind(this);
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
    		<CustomerWifiForm
    		  customerId={customer && customer._id}
    		  ssIds={customer && customer.ssIds}
    		 />
    	</Tab>
		  <Tab eventKey="exportData" title="Data">
		  	<CustomerDataForm
		  		customerId={customer && customer._id}
		  		dataDelivery={customer && customer.dataDelivery}
		  	/>
		  </Tab>


		  <Tab eventKey="readers" title="Readers">
			  <CustomerReaderForm customerId={customer && customer._id} />
		  </Tab>


		  <Tab eventKey="beacons" title="Beacons">
		  	<CustomerBeaconForm customerId={customer && customer._id} />
          <h4 className="page-header">Beacons - Search</h4> 
          <p>Type of Search - Dropdown (either: Beacon Type, Beacon MAC Address, Reader Serial Number</p> 
          <p>-------------------------------------------</p> 
          <p>Search - Beacon Type - Dropdown elements are sourced by querying Beacon Types in Customer Beacons Collection</p> 
          <p>____________________ - List beacons of the Beacon Type selected in MAC Address order</p> 
          <p>Search - Beacon MAC Address - list beacons where Search String is contained in the Beacon MAC Addresses</p> 
          <p>Search - Reader Serial Number - list beacons where Search String is contained in the Reader Serial Numbers</p> 
          <p>-------------------------------------------</p> 
          <h4 className="page-header">Beacons - Search</h4> 
          <p>Type of Search - Dropdown (either: Beacon Type, Beacon MAC Address, Reader Serial Number</p> 
          <p>-------------------------------------------</p> 
          <p>Search - Beacon Type - Dropdown elements are sourced by querying</p>
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
