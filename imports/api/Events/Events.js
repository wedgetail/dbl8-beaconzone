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
  CreatedDate: {
    type: Date,
    label: 'Date this document was created'
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
    type: ,
    label: 'The message object for the event.',
  },
    rdr: {
    type: String,
    label: 'The Reader that this event came through.',
  },
  man: {
  type: String,
  label: 'The Manufacturer of the beacon.',
},
  mac: {
    type: String,
    label: 'The MAC address of the beacon.',
  },
  uuid: {
    type: String,
    label: 'The UUID of the beacon.',
  },
  maj: {
    type: String,
    label: 'The Major value reported by the beacon.',
  },
  min: {
    type: String,
    label: 'The Minor value reported by the beacon.',
  },
  batt: {
    type: String,
    label: 'The Battery value reported by the beacon.',
  },
  temp: {
    type: String,
    label: 'The Temperature value reported by the beacon.',
  },
  Hmdt: {
    type: String,
    label: 'The Humidity value reported by the beacon.',
  },
  txpwr: {
    type: String,
    label: 'The Tx Power value of the beacon.',
  },
  rssi: {
    type: String,
    label: 'The RSSI value of the event.',
  },
  unique: {
    type: String,
    label: 'A unique value for this event (concat various field values).',
  },
});

Events.attachSchema(EventsSchema);

export default Events;
