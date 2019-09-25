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
  Events.find({ createdAt: { $gte: (Math.floor(new Date().getTime() / 1000) - 60) } }).fetch().forEach((event) => {
    const existingCustomer = Customers.findOne({ beaconUUIDs: { $in: [event.message.uuid] } });
    const beaconToInsert = {
      beaconType: event.message.maj,
      macAddress: event.message.mac,
    };

    if (existingCustomer) {
      beaconToInsert.customer = existingCustomer._id;
      beaconToInsert.whitelisted = 'true'; // Do this as a string to match schema.
    }

    //console.log(beaconToInsert);

    // NOTE: Do an upsert so changes to the beacon's major (beaconType) are properly
    // updated in the db.
    Beacons.upsert({ macAddress: event.message.mac, beaconType: event.message.maj }, {
      $set: {
        ...beaconToInsert,
      },
    });
  });
}), refetchInterval);
