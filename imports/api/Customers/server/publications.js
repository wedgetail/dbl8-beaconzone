import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Customers from '../Customers';
import Readers from '../../Readers/Readers';

Meteor.publish('customers', function customers() {
	// TODO: Revisit this for security and pagination.
  return Customers.find();
});

Meteor.publish('customers.manage', function customersManage(customerId) {
  check(customerId, String);
  return Customers.find({ _id: customerId });
});

Meteor.publish('customers.readers', function customersReaders(customer) {
  check(customer, String);
  return Readers.find({ customer: customer }, { sort: { serialNumber: 1 } });
});
