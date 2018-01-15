import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Customers from '../Customers';

Meteor.publish('customers', function customers() {
	// TODO: Revisit this for security and pagination.
  return Customers.find();
});

Meteor.publish('customers.manage', function customersManage(customerId) {
  check(customerId, String);
  return Customers.find({ _id: customerId });
});
