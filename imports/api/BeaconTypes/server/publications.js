import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import BeaconTypes from '../BeaconTypes';

Meteor.publish('beaconTypes', () => BeaconTypes.find()); // Implicit return.

// Note: beaconTypes.view is also used when editing an existing document.
Meteor.publish('beaconTypes.view', (beaconTypeId) => {
  check(beaconTypeId, String);
  return BeaconTypes.find({ _id: beaconTypeId });
});
