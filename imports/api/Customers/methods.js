import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Customers from './Customers';
import Readers from '../Readers/Readers';

Meteor.methods({
  'customers.insert': function customersInsert(customerName) {
    check(customerName, String);

    try {
    	return Customers.insert({ name: customerName });
    } catch (exception) {
      console.warn(exception);
    	throw new Meteor.Error('500', exception);
    }
  },
  'customers.update': function customersUpdate(customer) {
    check(customer, Object);

    try {
      const customerId = customer._id;
      delete customer._id;
      return Customers.update({ _id: customerId }, { $set: customer });
    } catch (exception) {
      console.warn(exception);
      throw new Meteor.Error('500', exception);
    }
  },
  'customers.uploadReadersCSV': function customersUploadReadersCSV(readers) {
    check(readers, [Object]);

    try {
      let readersAdded = 0;
      readers.forEach(({ serialNumber, macAddress, ...rest }) => {
        if (!Readers.findOne({ serialNumber, macAddress })) {
          Readers.insert({ serialNumber, macAddress, ...rest });
          readersAdded += 1;
        }
      });
      return readersAdded;
    } catch (exception) {
      console.warn(exception);
    	throw new Meteor.Error('500', exception);
    }
  },
});
