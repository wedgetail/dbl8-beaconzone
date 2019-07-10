// var Fiber = Npm.require("fibers");
import Fiber from 'fibers';
import mqtt from 'mqtt';
import moment from 'moment';
import MongoDB from 'mongodb';
import { Mongo } from 'meteor/mongo';
import Events from '../../api/Events/Events';
import Customers from '../../api/Customers/Customers';
import Beacons from '../../api/Beacons/Beacons';

const refetchInterval = 10000;

setInterval(Meteor.bindEnvironment(() => {
  console.log('FINDING EVENTS');
  Events.find({ createdAt: { $gte: (Math.floor(new Date().getTime() / 1000) - 60) } }).fetch().forEach((event) => {
    // TODO: Do we need to insert the events into the admin app Events collection, too?
    // TODO: Filter array down to unique macAddress. We only want one event per macAddress.
    // console.log(event);
    console.log(event.message.mac, event.message.uuid);
    const existingCustomer = Customers.findOne({ beaconUUIDs: { $in: [event.message.uuid] } });
    // console.log(event.message.mac, existingCustomer); b5b182c7eab14988aa99b5c1517008d9
    const beaconToInsert = {
      beaconType: event.message.maj,
      macAddress: event.message.mac,
      active: true,
    };

    if (existingCustomer) {
      beaconToInsert.customer = existingCustomer._id;
      beaconToInsert.whitelisted = 'true'; // Do this as a string to match schema.
    }

    console.log(beaconToInsert);
    if (existingCustomer && !Beacons.findOne({ macAddress: event.message.mac })) {
        Beacons.insert(beaconToInsert);
    }
  });
}), refetchInterval);
