import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Random } from 'meteor/random';
import Customers from './Customers';
import Readers from '../Readers/Readers';
import Events from '../Events/Events';
import Beacons from '../Beacons/Beacons';
import BeaconTypes from '../BeaconTypes/BeaconTypes';
import sendEmail from '../../modules/server/send-email';

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
  'customers.generateApiKey': function customersGenerateApiKey(customerId) {
    check(customerId, String);

    try {
      return Customers.update({ _id: customerId }, { $set: { apiKey: Random.hexString(20) } });
    } catch (exception) {
      console.warn(exception);
      throw new Meteor.Error('500', exception);
    }
  },
  'customers.inviteAdmin': function customersInviteAdmin(customerId) {
    check(customerId, String);

    try {
      const customer = Customers.findOne(customerId);

      if (customer) {
        return sendEmail({
          to: customer.email,
          from: 'support@dbl8.com',
          cc: 'ryan.glover@cleverbeagle.com',
          subject: '[DBL8 BeaconZone - Event Viewer] Let\'s Setup Your Account',
          template: 'invite-admin',
          templateVars: {
            customerEmail: customer.email,
            applicationName: 'DBL8 BeaconZone – Event Viewer',
            customerCode: customer.topicCode,
            url: `${Meteor.settings.private.view.domain}/setup`,
            //url: customer.hostedByDbl8 ? `${Meteor.settings.private.view.domain}/setup` : 'https://docs.dbl8.bz/setupEventViewer',
            hostedByDbl8: true,
            //hostedByDbl8: customer.hostedByDbl8,
          },
        });
      }

      throw new Error(`Customer with the _id ${customerId} not found.`);
    } catch (exception) {
      console.warn(exception);
      throw new Meteor.Error('500', exception);
    }
  },
  'customers.uploadReadersCSV': function customersUploadReadersCSV(readers) {
    check(readers, [Object]);

    try {
      let readersAdded = 0;
      readers.forEach(({ macAddress, ...rest }) => {
        if (!Readers.findOne({ macAddress })) {
          Readers.insert({ macAddress, ...rest });
          readersAdded += 1;
        }
      });
      return readersAdded;
    } catch (exception) {
      console.warn(exception);
      throw new Meteor.Error('500', exception);
    }
  },
  'customers.editDefaultJSON': function customersEditDefaultJSON(json) {
    check(json, Object);

    try {
      Customers.update({ _id: json.customerId }, { $set: { defaultReaderJSON: json.json } });
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
        const mostRecentEvent = Events.findOne({ 'message.rdr': reader.macAddress }, { sort: { createdAt: -1 } });
        return {
          ...reader,
          mostRecentEvent: mostRecentEvent ? mostRecentEvent.createdAt : 'N/A',
        };
      });
    } catch (exception) {
      console.warn(exception);
      throw new Meteor.Error('500', exception);
    }
  },
  'customers.fetchLatestBeaconData': function customersFetchLatestBeaconData(customer, beaconType, beaconSearch) {
    check(customer, String);
    check(beaconType, Match.OneOf(String, null));
    check(beaconSearch, Match.OneOf(Object, null));

    try {
      if (beaconSearch && beaconSearch.type === 'macAddress') {
        const searchRegex = new RegExp(beaconSearch.value, 'i');
        const readerEvents = Events.find({ 'message.rdr': searchRegex }, { fields: { 'message.rdr': 1, 'message.mac': 1, createdAt: 1 } }).fetch();
        const beaconsByMAC = Beacons.find({ customer: customer, macAddress: { $in: _.uniq(readerEvents.map(({ message }) => message.mac)) } }).fetch(); // Array of macAddresses ['123', '456']

        return {
          customer: Customers.findOne({ _id: customer }),
          beacons: beaconsByMAC.map((beacon) => {
            const mostRecentEvent = Events.findOne({ 'message.rdr': searchRegex }, { limit: 1, sort: { createdAt: -1 } });
            return {
              ...beacon,
              mostRecentEvent,
            };
          }),
          beaconTypes: BeaconTypes.find().fetch(),
        };
      } else {
        const beaconQuery = { customer: customer };
        if (beaconType && beaconType !== 'all') beaconQuery.beaconType = beaconType; // { beaconType: beaconType };
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
