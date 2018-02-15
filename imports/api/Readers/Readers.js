import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Readers = new Mongo.Collection('Readers');

Readers.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Readers.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const ReadersSchema = new SimpleSchema({
  customer: {
    type: String,
    label: 'The ID of the customer who owns this reader.',
  },
  readerActive: {
    type: Boolean,
    label: 'Is this reader active?',
  },
  serialNumber: {
    type: String,
    // unique: true,
    label: 'The serial number for the reader.',
  },
  macAddress: {
    type: String,
    unique: true,
    label: 'The mac address for the reader.',
  },
  customJSON: {
    type: Object,
    label: 'The custom JSON data for the reader.',
    optional: true,
  },
});

Readers.attachSchema(ReadersSchema);

export default Readers;
