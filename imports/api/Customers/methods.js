import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { _ } from 'meteor/underscore';
import Customers from './Customers';
import Readers from '../Readers/Readers';
import Events from '../Events/Events';
import Beacons from '../Beacons/Beacons';
import BeaconTypes from '../BeaconTypes/BeaconTypes';

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
  'customers.addBeaconUUID': function customersAddBeaconUUID(uuid) {
    check(uuid, Object);

    try {
      Customers.update(uuid.customer, { $addToSet: { beaconUUIDs: uuid.uuid } });
    } catch (exception) {
      console.warn(exception);
      throw new Meteor.Error('500', exception);
    }
  },
  'customers.deleteBeaconUUID': function customersDeleteBeaconUUID(uuid) {
    check(uuid, Object);

    try {
      if (!Events.findOne({ 'message.uuid': uuid.uuid })) {
        Customers.update(uuid.customer, { $pull: { beaconUUIDs: uuid.uuid } });
      } else {
        throw new Meteor.Error('500', 'Cannot delete a UUID that\'s in use.');
      }
    } catch (exception) {
      console.warn(exception);
    	throw new Meteor.Error('500', exception);
    }
  },
  'customers.fetchLatestReaderData': function customersFetchLatestReaderData(customerId) {
    check(customerId, String);

    try {
      return Readers.find({ customer: customerId }).fetch().map((reader) => {
        const mostRecentEvent = Events.findOne({ 'message.rdr': reader.serialNumber }, { sort: { createdAt: -1 } });
        return {
          ...reader,
          mostRecentEvent: mostRecentEvent.createdAt,
        };
      });
    } catch (exception) {
      console.warn(exception);
      throw new Meteor.Error('500', exception);
    }
  },
  'customers.fetchLatestBeaconData': function customersFetchLatestBeaconData(customer, beaconTypeCode, beaconSearch) {
    check(customer, String);
    check(beaconTypeCode, Match.OneOf(String, null));
    check(beaconSearch, Match.OneOf(Object, null));

    try {
      if (beaconSearch && beaconSearch.type === 'serialNumber') {
        const searchRegex = new RegExp(beaconSearch.value, 'i');
        const readerEvents = Events.find({ 'message.rdr': searchRegex }, { fields: { 'message.rdr': 1, 'message.mac': 1, createdAt: 1 } }).fetch();
        const beaconsByMAC = Beacons.find({ customer: customer, macAddress: { $in: _.uniq(readerEvents.map(({ message }) => message.mac)) } }).fetch(); // Array of macAddresses ['123', '456']

        return {
          customer: Customers.findOne({ _id: customer }),
          beacons: beaconsByMAC.map((beacon) => {
            const mostRecentEvent = Events.findOne({ 'message.mac': beacon.macAddress, 'message.rdr': searchRegex }, { limit: 1, sort: { createdAt: -1 } });
            return {
              ...beacon,
              mostRecentEvent,
            };
          }),
          beaconTypes: BeaconTypes.find().fetch(),
        };
      } else {
        const beaconQuery = { customer: customer };
        if (beaconTypeCode && beaconTypeCode !== 'all') beaconQuery.beaconTypeCode = beaconTypeCode; // { beaconTypeCode: beaconTypeCode };
        if (beaconSearch && beaconSearch.type === 'macAddress') beaconQuery.macAddress = new RegExp(beaconSearch.value, 'i'); // /aelkjre9r8era/i

        return {
          customer: Customers.findOne({ _id: customer }),
          beacons: Beacons.find(beaconQuery, { sort: { macAddress: 1 } }).fetch().map((beacon) => {
            const mostRecentEvent = Events.findOne({ 'message.mac': beacon.macAddress }, { limit: 1, sort: { createdAt: -1 } });
            return {
              ...beacon,
              mostRecentEvent,
            };
          }),
          beaconTypes: BeaconTypes.find().fetch(),
        };
      }
    } catch (exception) {
      console.warn(exception);
      throw new Meteor.Error('500', exception);
    }
  },
});
