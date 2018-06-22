/* eslint-disable jsx-a11y/no-href */

import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import Navigation from '../../components/Navigation/Navigation';
import Authenticated from '../../components/Authenticated/Authenticated';
import Public from '../../components/Public/Public';
import Index from '../../pages/Index/Index';
import BeaconTypes from '../../pages/BeaconTypes/BeaconTypes';
import NewBeaconType from '../../pages/NewBeaconType/NewBeaconType';
import ViewBeaconType from '../../pages/ViewBeaconType/ViewBeaconType';
import EditBeaconType from '../../pages/EditBeaconType/EditBeaconType';
import Signup from '../../pages/Signup/Signup';
import Login from '../../pages/Login/Login';
import Logout from '../../pages/Logout/Logout';
import VerifyEmail from '../../pages/VerifyEmail/VerifyEmail';
import RecoverPassword from '../../pages/RecoverPassword/RecoverPassword';
import ResetPassword from '../../pages/ResetPassword/ResetPassword';
import Profile from '../../pages/Profile/Profile';
import Customers from '../../pages/Customers/Customers';
import NewCustomer from '../../pages/NewCustomer/NewCustomer';
import ManageCustomer from '../../pages/ManageCustomer/ManageCustomer';
import NotFound from '../../pages/NotFound/NotFound';
import Footer from '../../components/Footer/Footer';
import Terms from '../../pages/Terms/Terms';
import Privacy from '../../pages/Privacy/Privacy';
import ExamplePage from '../../pages/ExamplePage/ExamplePage';
import VerifyEmailAlert from '../../components/VerifyEmailAlert/VerifyEmailAlert';
import getUserName from '../../../modules/get-user-name';

import './App.scss';

const App = props => (
  <Router>
    {!props.loading ? (
      <div className="App">
        {props.authenticated ?
          <VerifyEmailAlert
            user={props.user}
            userId={props.userId}
            emailVerified={props.emailVerified}
            emailAddress={props.emailAddress}
          />
          : ''}
        <Navigation {...props} />
        <Grid>
          <Switch>
            <Route exact name="index" path="/" component={Index} />
            <Authenticated exact path="/profile" component={Profile} {...props} />
            <Authenticated exact path="/admin/customers" component={Customers} {...props} />
            <Authenticated exact path="/admin/customers/new" component={NewCustomer} {...props} />
            <Authenticated exact path="/admin/customers/:_id" component={ManageCustomer} {...props} />
            <Authenticated exact path="/admin/beaconTypes" component={BeaconTypes} {...props} />
            <Authenticated exact path="/admin/beaconTypes/new" component={NewBeaconType} {...props} />
            <Authenticated exact path="/admin/beaconTypes/:_id" component={ViewBeaconType} {...props} />
            <Authenticated exact path="/admin/beaconTypes/:_id/edit" component={EditBeaconType} {...props} />
            <Public path="/signup" component={Signup} {...props} />
            <Public path="/login" component={Login} {...props} />
            <Route path="/logout" component={Logout} {...props} />
            <Route name="verify-email" path="/verify-email/:token" component={VerifyEmail} />
            <Route name="recover-password" path="/recover-password" component={RecoverPassword} />
            <Route name="reset-password" path="/reset-password/:token" component={ResetPassword} />
            <Route name="terms" path="/terms" component={Terms} />
            <Route name="privacy" path="/privacy" component={Privacy} />
            <Route name="examplePage" path="/example-page" component={ExamplePage} />
            <Route component={NotFound} />
          </Switch>
        </Grid>
        <Footer />
      </div>
    ) : ''}
  </Router>
);

App.defaultProps = {
  userId: '',
  emailAddress: '',
};

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  emailAddress: PropTypes.string,
  emailVerified: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  const loading = !Roles.subscription.ready();
  const name = user && user.profile && user.profile.name && getUserName(user.profile.name);
  const emailAddress = user && user.emails && user.emails[0].address;

  return {
    loading,
    loggingIn,
    authenticated: !loggingIn && !!userId,
    name: name || emailAddress,
    roles: !loading && Roles.getRolesForUser(userId),
    userId,
    user,
    emailAddress,
    emailVerified: user && user.emails ? user && user.emails && user.emails[0].verified : true,
  };
})(App);
