import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import Customers from '../../../api/Customers/Customers';

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
