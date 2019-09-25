import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import BeaconTypesCollection from '../../../api/BeaconTypes/BeaconTypes';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';

import './BeaconTypes.scss';

const handleRemove = (documentId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('beaconTypes.remove', documentId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Beacon type deleted!', 'success');
      }
    });
  }
};

const BeaconTypes = ({
  loading, beaconTypes, match, history,
}) => (!loading ? (
  <div className="BeaconTypes">
    <div className="page-header clearfix">
      <h4 className="pull-left">Beacon Types</h4>
      <Link className="btn btn-success btn-sm pull-right" to={`${match.url}/new`}>Add Beacon Type</Link>
    </div>
    {beaconTypes.length ?
      <Table responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Major</th>
            <th>Button Events</th>
            <th>Last Updated</th>
            <th>Created</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {beaconTypes.map(({
            _id, title, hasButton, beaconTypeCode, createdAt, updatedAt,
          }) => (
            <tr key={_id}>
              <td>{title}</td>
              <td>{beaconTypeCode}</td>
              <td className="text-center">{hasButton ? <strong>Yes</strong> : 'No'}</td>
              <td>{timeago(updatedAt)}</td>
              <td>{monthDayYearAtTime(createdAt)}</td>
              <td className="text-right">
                <Button
                  bsStyle="primary"
                  bsSize="small"
                  onClick={() => history.push(`${match.url}/${_id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  bsStyle="danger"
                  bsSize="small"
                  onClick={() => handleRemove(_id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> : <Alert bsStyle="warning">No beacon types yet!</Alert>}
  </div>
) : <Loading />);

BeaconTypes.propTypes = {
  loading: PropTypes.bool.isRequired,
  beaconTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('beaconTypes');
  return {
    loading: !subscription.ready(),
    beaconTypes: BeaconTypesCollection.find({}, { sort: { title: 1 } }).fetch(),
  };
})(BeaconTypes);
