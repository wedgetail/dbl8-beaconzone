import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import SimpleSchema from 'simpl-schema';

const Customers = new Mongo.Collection('Customers');

Customers.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Customers.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const CustomersSchema = new SimpleSchema({
  eventViewerDashboardTimeout: {
    type: Number,
    label: 'The timeout for the customer\'s event viewer dashboard (in seconds).',
    optional: true,
  },
  numberOfEventViewerUsers: {
    type: Number,
    defaultValue: 5,
    label: 'The number of users allowed to access the event viewer dashboard.',
    optional: true,
  },
  users: {
    type: Array,
    label: 'Users who have access to this customer.',
    defaultValue: [],
  },
    'users.$': {
      type: Object,
      label: 'A user who has access to this customer.',
    },
      'users.$.userId': {
        type: String,
        label: 'The _id of the user who has access to this customer.',
      },
      'users.$.isAdmin': {
        type: Boolean,
        label: 'Is the user an admin for this customer?',
      },
  name: {
    type: String,
    label: 'The name of the customer.',
  },
  topicCode: {
    type: String,
    label: 'MQTT topic code for the customer.',
    autoValue() {
      if (this.isInsert) return Random.hexString(10);
    },
  },
  apiKey: {
    type: String,
    label: 'API key for the customer.',
    autoValue() {
      if (this.isInsert) return Random.hexString(20);
    },
  },
  contact: {
    type: String,
    label: 'Primary contact name for the customer.',
    optional: true,
  },
  address: {
    type: String,
    label: 'Address for the customer.',
    optional: true,
  },
  city: {
    type: String,
    label: 'City for the customer.',
    optional: true,
  },
  state: {
    type: String,
    label: 'State for the customer.',
    optional: true,
  },
  zip: {
    type: String,
    label: 'Zip for the customer.',
    optional: true,
  },
  mobile: {
    type: String,
    label: 'Mobile number for the customer.',
    optional: true,
  },
  telephone: {
    type: String,
    label: 'Telephone number for the customer.',
    optional: true,
  },
  email: {
    type: String,
    label: 'General email for the customer.',
    optional: true,
  },
  ssIds: {
    type: Object,
    label: 'SSIDs for the customer.',
    optional: true,
  },
  'ssIds.one': {
    type: Object,
    label: 'An SSID for the customer.',
  },
  'ssIds.one.ssid': {
    type: String,
    label: 'The SSID for connection #1.',
  },
  'ssIds.one.securityKey': {
    type: String,
    label: 'The security key for connection #1.',
  },
  'ssIds.two': {
    type: Object,
    label: 'An SSID for the customer.',
    optional: true,
  },
  'ssIds.two.ssid': {
    type: String,
    label: 'The SSID for connection #2.',
    optional: true,
  },
  'ssIds.two.securityKey': {
    type: String,
    label: 'The security key for connection #2.',
    optional: true,
  },
  'ssIds.three': {
    type: Object,
    label: 'An SSID for the customer.',
    optional: true,
  },
  'ssIds.three.ssid': {
    type: String,
    label: 'The SSID for connection #3.',
    optional: true,
  },
  'ssIds.three.securityKey': {
    type: String,
    label: 'The security key for connection #3.',
    optional: true,
  },
  dataDelivery: {
    type: Object,
    label: 'How data is delivered for the customer.',
    optional: true,
  },
  'dataDelivery.type': {
    type: String,
    label: 'The type of data delivery.',
  },
  'dataDelivery.config': {
    type: Object,
    label: 'Config data for the delivery type.',
    blackbox: true,
  },
  beaconUUIDs: {
    type: Array,
    label: 'UUIDs for the customer\'s beacons.',
    defaultValue: [],
  },
  'beaconUUIDs.$': {
    type: String,
    label: 'A UUID for the customer.',
  },
  defaultReaderJSON: {
    type: String,
    label: 'The default JSON for this customer\'s readers.',
    optional: true,
  },
});

Customers.attachSchema(CustomersSchema);

export default Customers;
