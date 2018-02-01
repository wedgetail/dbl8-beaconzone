import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Beacons = new Mongo.Collection('Beacons');

Beacons.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Beacons.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const BeaconsSchema = new SimpleSchema({
  beaconType: {
    type: String,
    label: 'The type of beacon.',
  },
  macAddress: {
    type: String,
    label: 'The mac address for this beacon.',
    unique: true,
  },
  customer: {
    type: String,
    label: 'The ID of the customer this beacon belongs to.',
  },
});

Beacons.attachSchema(BeaconsSchema);

export default Beacons;
