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
const mongodb = MongoDB.MongoClient;

setInterval(Meteor.bindEnvironment(() => {
  Events.find({ createdAt: { $gte: (new Date().getTime() - 60000) } }).fetch().forEach((event) => {
    // TODO: Do we need to insert the events into the admin app Events collection, too?
    // TODO: Filter array down to unique macAddress. We only want one event per macAddress.

    const existingCustomer = Customers.findOne({ beaconUUIDs: { $in: [event.message.uuid] } });
    const beaconToInsert = {
      beaconType: event.message.maj,
      macAddress: event.message.mac,
      active: true,
    };

    if (existingCustomer) {
      beaconToInsert.customer = existingCustomer._id;
      beaconToInsert.whitelisted = 'true'; // Do this as a string to match schema.
    }

    if (!Beacons.findOne({ macAddress: event.message.mac })) {
        Beacons.insert(beaconToInsert);
    }
  });

  // mongodb.connect(Meteor.settings.private.eventViewerData.MONGO_URL, { useNewUrlParser: true }, Meteor.bindEnvironment(function(error, client) {
  //   if (error) {
  //     console.warn(error);
  //     // response.status(500);
  //     // response.end(error);
  //   } else {
  //     const db = client.db(process.env.NODE_ENV);
  //
  //     db.collection('Events').find({ createdAt: { $gte: (new Date().getTime() - 60000) } }).toArray(Meteor.bindEnvironment(function(error, events) {
  //       console.log(events);
  //       events.forEach((event) => {
  //         // TODO: Do we need to insert the events into the admin app Events collection, too?
  //         // TODO: Filter array down to unique macAddress. We only want one event per macAddress.
  //
  //         const existingCustomer = Customers.findOne({ beaconUUIDs: { $in: [event.message.uuid] } });
  //         const beaconToInsert = {
  //           beaconType: event.message.maj,
  //           macAddress: event.message.mac,
  //           active: true,
  //         };
  //
  //         if (existingCustomer) {
  //           beaconToInsert.customer = existingCustomer._id;
  //           beaconToInsert.whitelisted = 'true'; // Do this as a string to match schema.
  //         }
  //
  //         console.log('NEW BEACON', beaconToInsert);
  //
  //         if (!Beacons.findOne({ macAddress: event.message.mac })) {
  //             Beacons.insert(beaconToInsert);
  //         }
  //       });
  //     }));
  //   }
  // }));
}), refetchInterval);
