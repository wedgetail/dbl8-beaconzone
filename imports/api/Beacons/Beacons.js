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
  whitelisted: {
    type: String,
    allowedValues: ['null', 'true', 'false'],
    defaultValue: 'null',
    label: 'Is this beacon recognized (or ignored) by the customer receiving its events?',
  },
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
    optional: true,
  },
  active: {
    type: Boolean,
    label: 'Is the beacon active?',
    optional: true,
  },
});

Beacons.attachSchema(BeaconsSchema);

export default Beacons;
