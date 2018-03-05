import { Meteor } from 'meteor/meteor';
import Dashboard from '../Dashboard/Dashboard';

Meteor.methods({
  'dashboard': function dashboardLineChart() {
    console.log(Dashboard.findOne({ name: 'dashboard' }));
    return Dashboard.findOne({ name: 'dashboard' });
  },
});
