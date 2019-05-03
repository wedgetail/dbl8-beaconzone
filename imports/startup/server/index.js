import './mqtt';
import './accounts';
import '../both/api';
import './api';
import './fixtures';
import './email';
import Gromit from './gromit';

Meteor.startup(() => {
  Gromit.watch();
});
