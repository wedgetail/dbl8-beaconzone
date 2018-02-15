import React from 'react';
import PropTypes from 'prop-types';
import { ControlLabel, Table, Button } from 'react-bootstrap';
import Papa from 'papaparse';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Readers from '../../../api/Readers/Readers';
import Events from '../../../api/Events/Events';
import InputHint from '../InputHint/InputHint';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import { monthDayYearAtTime } from '../../../modules/dates';

import './CustomerReaderForm.scss';

class CustomerReaderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { uploading: false, readers: [] };
    this.handleUploadCSV = this.handleUploadCSV.bind(this);
    this.fetchReaderData = this.fetchReaderData.bind(this);
  }

  handleUploadCSV(event) {
    if (event.target.files.length > 0) {
      const component = this;
      component.setState({ uploading: true });
      Papa.parse(event.target.files[0], {
        header: true,
        complete(results, file) {
          if (results && results.data.length) {
            const customerReaders = results.data.map((reader) => ({
              ...reader,
              customer: component.props.customerId,
              readerActive: true,
            }));

            Meteor.call('customers.uploadReadersCSV', customerReaders, (error, readersAdded) => {
              if (error) {
                Bert.alert(error.reason, 'danger');
              } else {
                Bert.alert(`${readersAdded} readers uploaded!`, 'success');
                component.setState({ uploading: false });
              }
            });
          }
        },
      });
    }
  }

  fetchReaderData() {
    Meteor.call('customers.fetchLatestReaderData', this.props.customerId, (error, readers) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.setState({ readers: readers });
      }
    });
  }

  componentWillMount() {
    this.fetchReaderData();
  }

  handleUpdateReaderStatus(status) {
    Meteor.call('readers.updateStatus', status, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Status updated!', 'success');
      }
    });
  }

  render() {
    return (<div className="CustomerReaderForm">
    	<div className="CustomerReaderForm__upload">
    	  <ControlLabel>Upload a CSV</ControlLabel>
		    {this.state.uploading ? <p>Uploading...</p> : <input
    	    type="file"
    	    className="form-control"
            onChange={this.handleUploadCSV}
    	  />}
    	  <InputHint>Upload .csv list of readers for this customer.</InputHint>
    	</div>
      <Button onClick={this.fetchReaderData} bsStyle="success">Fetch Latest Data</Button>
    	<Table responsive bordered>
    		<thead>
    			<tr>
            <th>Active?</th>
    				<th>Custom JSON</th>
    				<th>Serial Number</th>
    				<th>MAC Address</th>
    				<th>Last Event Received</th>
    			</tr>
    		</thead>
    		<tbody>
          {this.state.readers.map(({ _id, readerActive, customJSON, serialNumber, macAddress, mostRecentEvent }) => (
            <tr>
              <td><ToggleSwitch id={_id} toggled={readerActive} onLabel="Yes" offLabel="No" onToggle={(readerId, isReaderActive) => this.handleUpdateReaderStatus({ _id: readerId, readerActive: isReaderActive })} /></td>
              <td><a href="#">{customJSON}</a></td>
              <td>{serialNumber}</td>
              <td>{macAddress}</td>
              <td>{monthDayYearAtTime(mostRecentEvent)}</td>
            </tr>
          ))}
    		</tbody>
    	</Table>
    </div>);
  }
}

CustomerReaderForm.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default CustomerReaderForm;

