import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import validate from '../../../modules/validate';

class CustomerDataForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { connectionType: props.dataDelivery && props.dataDelivery.type || 'http' };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
  	const update = {
  		_id: this.props.customerId,
  		dataDelivery: {
  			type: this.connectionType.value,
  			config: {
  				host: this.connectionHost.value,
  				port: this.connectionPort.value,
  				resource: this.connectionResource ? this.connectionResource.value : '',
  				topic: this.connectionTopic ? this.connectionTopic.value : '',
  				username: this.connectionUsername ? this.connectionUsername.value : '',
  				password: this.connectionPassword ? this.connectionPassword.value : '',
  			},
  		},
  	};

  	Meteor.call('customers.update', update, (error, response) => {
  	  if (error) {
  	    Bert.alert(error.reason, 'danger');
  	  } else {
  	    Bert.alert('Customer updated!', 'success');
  	  }
  	});
  }

  componentDidMount() {
  	const component = this;
  	validate(this.editExportData, {
  		rules: {
  			connectionType: {
  				required: true,
  			},
  			connectionHost: {
  				required: true,
  			},
  			connectionPort: {
  				required: true,
  			},
  			connectionResource: {
  				required: true,
  			},
  			connectionTopic: {
  				required: true,
  			},
  			connectionUsername: {
  				required: true,
  			},
  			connectionPassword: {
  				required: true,
  			},
  		},
  		messages: {
  			connectionType: {
  				required: 'Select a connection type.',
  			},
  			connectionHost: {
  				required: 'Need a host domain.',
  			},
  			connectionPort: {
  				required: 'Need a port number.',
  			},
  			connectionResource: {
  				required: 'Need a resource path.',
  			},
  			connectionTopic: {
  				required: 'Need a topic.',
  			},
  			connectionUsername: {
  				required: 'Need a username.',
  			},
  			connectionPassword: {
  				required: 'Need a password.',
  			},
  		},
  		submitHandler() { component.handleSubmit(); },
  	});
  }

  render() {
  	const { dataDelivery } = this.props;
    return (<div className="CustomerDataForm">
		  <form ref={editExportData => (this.editExportData = editExportData)} onSubmit={(event) => event.preventDefault()}>
			  <h4 className="page-header">Data Delivery Method</h4>
			  <FormGroup>
				  <Row>
					  <Col xs={2}>
						  <ControlLabel>Connection Type</ControlLabel>
						  <select
							  name="connectionType"
							  value={this.state.connectionType}
							  onChange={(event) => this.setState({ connectionType: event.target.value })}
							  ref={connectionType => (this.connectionType = connectionType)}
							  className="form-control"
						  >
						    <option value="http">HTTP</option>
						    <option value="websocket">WebSocket</option>
						    <option value="mqtt">MQTT</option>
						  </select>
					  </Col>
				  </Row>
				  <Row>
					  <Col xs={4}>
						  <ControlLabel>Host</ControlLabel>
						  <input
							  type="text"
							  name="connectionHost"
							  defaultValue={dataDelivery && dataDelivery.config && dataDelivery.config.host}
							  ref={connectionHost => (this.connectionHost = connectionHost)}
							  className="form-control"
							  placeholder="domain.com or IP Address"
						  />
					  </Col>
					  <Col xs={4}>
						  <ControlLabel>Port</ControlLabel>
						  <input
							  type="text"
							  name="connectionPort"
							  defaultValue={dataDelivery && dataDelivery.config && dataDelivery.config.port}
							  ref={connectionPort => (this.connectionPort = connectionPort)}
							  className="form-control"
							  placeholder="3000"
						  />
					  </Col>
					  {this.state.connectionType !== 'mqtt' ? <Col xs={4}>
						  <ControlLabel>Resource</ControlLabel>
						  <input
							  type="text"
							  name="connectionResource"
							  defaultValue={dataDelivery && dataDelivery.config && dataDelivery.config.resource}
							  ref={connectionResource => (this.connectionResource = connectionResource)}
							  className="form-control"
							  placeholder="/api/v1/readers"
						  />
					  </Col> : ''}
				  </Row>
				  {this.state.connectionType === 'mqtt' ? <Row>
						<Col xs={4}>
						  <ControlLabel>Topic</ControlLabel>
						  <input
							  type="text"
							  name="connectionTopic"
							  defaultValue={dataDelivery && dataDelivery.config && dataDelivery.config.topic}
							  ref={connectionTopic => (this.connectionTopic = connectionTopic)}
							  className="form-control"
							  placeholder="Topic"
						  />
					  </Col>
					  <Col xs={4}>
						  <ControlLabel>Username (optional)</ControlLabel>
						  <input
							  type="text"
							  name="connectionUsername"
							  defaultValue={dataDelivery && dataDelivery.config && dataDelivery.config.username}
							  ref={connectionUsername => (this.connectionUsername = connectionUsername)}
							  className="form-control"
							  placeholder="Username"
						  />
					  </Col>
					  <Col xs={4}>
						  <ControlLabel>Password (optional)</ControlLabel>
						  <input
							  type="text"
							  name="connectionPassword"
							  defaultValue={dataDelivery && dataDelivery.config && dataDelivery.config.password}
							  ref={connectionPassword => (this.connectionPassword = connectionPassword)}
							  className="form-control"
							  placeholder="Password"
						  />
					  </Col>
				  </Row> : ''}
			  </FormGroup>
			  <Button type="submit" bsStyle="success">Save</Button>
		  </form>
    </div>);
  }
}

CustomerDataForm.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default CustomerDataForm;
