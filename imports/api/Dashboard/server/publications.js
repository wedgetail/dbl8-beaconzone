import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
// import { check, Match } from 'meteor/check';
import Events from '../../Events/Events';

Meteor.publish('dashboard', function dashboard() {
  // 2017-08-01T08:22:33Z
  Counts.publish(this, 'dashboard_events-per-hour', Events.find({ createdAt: { $gte: moment().subtract(24, 'hours').toDate().toString(), $lte: moment().toDate().toString() } }));
});
