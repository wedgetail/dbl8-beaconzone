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
  owner: {
    type: String,
    label: 'The ID of the owner of this reader.',
  },
  serialNumber: {
    type: String,
    label: 'The serial number for the reader.',
  },

  macAddress: {
    type: String,
    label: 'The mac address for the reader.',
  }
});

Readers.attachSchema(ReadersSchema);

export default Readers;
