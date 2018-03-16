import { Meteor } from 'meteor/meteor';
import Dashboard from '../Dashboard/Dashboard';

Meteor.methods({
  'dashboard': function dashboardLineChart() {
    return Dashboard.findOne({ name: 'dashboard' });
  },
});
