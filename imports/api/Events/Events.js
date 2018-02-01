import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Events = new Mongo.Collection('Events');

Events.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Events.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

const EventsSchema = new SimpleSchema({
  createdAt: {
    type: String,
    label: 'Date this event was created.',
  },
  owner: {
    type: String,
    label: 'The ID of the owner of this event.',
  },
  topic: {
    type: String,
    label: 'The MQTT Topic that this event was received from.',
  },
  message: {
    type: Object,
    label: 'The message object for the event.',
  },
  'message.rdr': {
    type: String,
    label: 'The Reader that this event came through.',
    optional: true,
  },
  'message.man': {
    type: String,
    label: 'The Manufacturer of the beacon.',
    optional: true,
  },
  'message.mac': {
    type: String,
    label: 'The MAC address of the beacon.',
    optional: true,
  },
  'message.uuid': {
    type: String,
    label: 'The UUID of the beacon.',
    optional: true,
  },
  'message.maj': {
    type: String,
    label: 'The Major value reported by the beacon.',
    optional: true,
  },
  'message.min': {
    type: String,
    label: 'The Minor value reported by the beacon.',
    optional: true,
  },
  'message.batt': {
    type: String,
    label: 'The Battery value reported by the beacon.',
    optional: true,
  },
  'message.temp': {
    type: String,
    label: 'The Temperature value reported by the beacon.',
    optional: true,
  },
  'message.hmdt': {
    type: String,
    label: 'The Humidity value reported by the beacon.',
    optional: true,
  },
  'message.txpwr': {
    type: String,
    label: 'The Tx Power value of the beacon.',
    optional: true,
  },
  'message.rssi': {
    type: String,
    label: 'The RSSI value of the event.',
    optional: true,
  },
  'message.unique': {
    type: String,
    label: 'A unique value for this event (concat various field values).',
    optional: true,
  },
});

Events.attachSchema(EventsSchema);

export default Events;
