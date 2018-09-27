/* eslint-disable consistent-return */

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

BeaconTypes.schema = new SimpleSchema({
  createdAt: {
    type: String,
    label: 'The date this beacon type was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this beacon type was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
  title: {
    type: String,
    label: 'The title of the beacon type.',
  },
  beaconTypeCode: {
    type: String,
    label: 'The code for the beacon type.',
    unique: true,
  },
  description: {
    type: String,
    label: 'The description of the beacon type.',
  },
  parseMap: {
    type: String,
    label: 'Parse map for major and minor values in b1.',
  },
});

BeaconTypes.attachSchema(BeaconTypes.schema);

export default BeaconTypes;
