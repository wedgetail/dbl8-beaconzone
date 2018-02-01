import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Customers from '../Customers';
import Readers from '../../Readers/Readers';
import Beacons from '../../Beacons/Beacons';
import Events from '../../Events/Events';

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

Meteor.publish('customers.beacons', function customersBeacons(customer) {
  check(customer, String);
  const beacons = Beacons.find({ customer: customer });

  return [
    Customers.find({ _id: customer }),
		Beacons.find({ customer: customer }, { sort: { macAddress: 1 } }),
		Events.find({ 'message.mac': { $in: beacons.fetch().map(({ macAddress }) => macAddress) } }, { sort: { createdAt: -1 } }),
  ];
});
