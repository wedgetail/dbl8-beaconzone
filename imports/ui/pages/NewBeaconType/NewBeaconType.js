import React from 'react';
import PropTypes from 'prop-types';
import BeaconTypeEditor from '../../components/BeaconTypeEditor/BeaconTypeEditor';

const NewBeaconType = ({ history }) => (
  <div className="NewBeaconType">
    <h4 className="page-header">New Beacon Type</h4>
    <BeaconTypeEditor history={history} />
  </div>
);

NewBeaconType.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewBeaconType;
