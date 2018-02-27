import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const BeaconTypes = new Mongo.Collection('BeaconTypes');

BeaconTypes.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

BeaconTypes.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const BeaconTypesSchema = new SimpleSchema({
  beaconCode: {
    type: String,
    label: 'The code for the beacon type.',
    unique: true,
  },
  description: {
    type: String,
    label: 'The description for this beacon type.',
  },
});

BeaconTypes.attachSchema(BeaconTypesSchema);

export default BeaconTypes;
