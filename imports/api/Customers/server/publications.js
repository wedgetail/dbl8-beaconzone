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

Meteor.publish('customers.beacons', function customersBeacons(customer, beaconType, beaconSearch) {
  check(customer, String);
  check(beaconType, Match.OneOf(String, null));
  check(beaconSearch, Match.OneOf(Object, null));

  if (beaconSearch && beaconSearch.type === 'serialNumber') {
    const readerEvents = Events.find({ 'message.rdr': new RegExp(beaconSearch.value, 'i') }, { fields: { 'message.rdr': 1, 'message.mac': 1, createdAt: 1 } });
    const beaconsByMAC = Beacons.find({ customer: customer, macAddress: { $in: readerEvents.fetch().map(({ message }) => message.mac) } }); // Array of macAddresses ['123', '456']

    return [
      Customers.find({ _id: customer }),
      beaconsByMAC,
      readerEvents,
    ];
  } else {
    const beaconQuery = { customer: customer };
    if (beaconType && beaconType !== 'all') beaconQuery.beaconType = beaconType; // { beaconType: beaconType };
    if (beaconSearch && beaconSearch.type === 'macAddress') beaconQuery.macAddress = new RegExp(beaconSearch.value, 'i'); // /aelkjre9r8era/i
    const beacons = Beacons.find(beaconQuery); // { customer: customer, beaconType: beaconType };

    return [
      Customers.find({ _id: customer }),
      Beacons.find(beaconQuery, { sort: { macAddress: 1 } }),
      Events.find({ 'message.mac': { $in: beacons.fetch().map(({ macAddress }) => macAddress) } }, { sort: { createdAt: -1 } }),
    ];
  }
});
