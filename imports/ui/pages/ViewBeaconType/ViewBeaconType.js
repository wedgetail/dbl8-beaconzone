import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import BeaconTypes from '../../../api/BeaconTypes/BeaconTypes';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const handleRemove = (beaconTypeId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('beaconTypes.remove', beaconTypeId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Beacon type deleted!', 'success');
        history.push('/admin/beaconTypes');
      }
    });
  }
};

const renderBeaconType = (beaconType, match, history) => (beaconType ? (
  <div className="ViewBeaconType">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ beaconType && beaconType.title } &mdash; { beaconType && beaconType.beaconTypeCode }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(beaconType._id, history)} className="text-danger">
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    { beaconType && beaconType.description }
  </div>
) : <NotFound />);

const ViewBeaconType = ({
  loading, beaconType, match, history,
}) => (
  !loading ? renderBeaconType(beaconType, match, history) : <Loading />
);

ViewBeaconType.defaultProps = {
  beaconType: null,
};

ViewBeaconType.propTypes = {
  loading: PropTypes.bool.isRequired,
  beaconType: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const beaconTypeId = match.params._id;
  const subscription = Meteor.subscribe('beaconTypes.view', beaconTypeId);

  return {
    loading: !subscription.ready(),
    beaconType: BeaconTypes.findOne(beaconTypeId),
  };
})(ViewBeaconType);
