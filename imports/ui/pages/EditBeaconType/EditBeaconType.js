import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import BeaconTypes from '../../../api/BeaconTypes/BeaconTypes';
import BeaconTypeEditor from '../../components/BeaconTypeEditor/BeaconTypeEditor';
import NotFound from '../NotFound/NotFound';

const EditBeaconType = ({ beaconType, history }) => (beaconType ? (
  <div className="EditBeaconType">
    <h4 className="page-header">{`Editing "${beaconType.title}"`}</h4>
    <BeaconTypeEditor beaconType={beaconType} history={history} />
  </div>
) : <NotFound />);

EditBeaconType.defaultProps = {
  beaconType: null,
};

EditBeaconType.propTypes = {
  beaconType: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const beaconTypeId = match.params._id;
  const subscription = Meteor.subscribe('beaconTypes.view', beaconTypeId);

  return {
    loading: !subscription.ready(),
    beaconType: BeaconTypes.findOne(beaconTypeId),
  };
})(EditBeaconType);
