import { Mongo } from 'meteor/mongo';
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
});

Customers.attachSchema(CustomersSchema);

export default Customers;
