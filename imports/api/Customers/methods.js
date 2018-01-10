import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Customers from './Customers';

Meteor.methods({
  'customers.insert': function customersInsert(customerName) {
    check(customerName, String);

    try {
    	return Customers.insert({ name: customerName });
    } catch (exception) {
    	throw new Meteor.Error('500', exception);
    }
  },
});

// Customers.update({ _id: customerId }, { $addToSet: { users: user } })