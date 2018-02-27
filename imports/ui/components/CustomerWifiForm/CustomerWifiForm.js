import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import validate from '../../../modules/validate';

class CustomerWifiForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
  	const update = {
  		_id: this.props.customerId,
  		ssIds: {
  			one: {
	  			ssid: this.ssidOne.value.trim(),
	  			securityKey: this.securityKeyOne.value.trim(),
	  		},
	  		two: {
	  			ssid: this.ssidTwo.value.trim(),
	  			securityKey: this.securityKeyTwo.value.trim(),
	  		},
	  		three: {
	  			ssid: this.ssidThree.value.trim(),
	  			securityKey: this.securityKeyThree.value.trim(),
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
  	validate(this.wifiForm, {
  		rules: {
  			ssidOne: {
  				required: true,
  			},
  			securityKeyOne: {
  				required: true,
  			},
  		},
  		messages: {
  			ssidOne: {
  				required: 'SSID #1 is required.',
  			},
  			securityKeyOne: {
  				required: 'What\'s the security key for SSID #1?',
  			},
  		},
  		submitHandler() { component.handleSubmit(); },
  	});
  }

  render() {
  	const { ssIds } = this.props;
    return (<div className="CustomerWifiForm">
			<form ref={wifiForm => (this.wifiForm = wifiForm)} onSubmit={(event) => event.preventDefault()}>
				<h4 className="page-header">SSID #1</h4>
	  		<Row>
	  			<Col xs={6}>
	  				<ControlLabel>SSID</ControlLabel>
	  				<input
	  					type="text"
	  					name="ssidOne"
	  					ref={ssidOne => (this.ssidOne = ssidOne)}
	  					defaultValue={ssIds && ssIds.one && ssIds.one.ssid}
	  					className="form-control"
	  					placeholder="Wi-Fi SSID"
	  				/>
	  			</Col>
	  			<Col xs={6}>
						<ControlLabel>Security Key</ControlLabel>
						<input
	  					type="text"
	  					name="securityKeyOne"
	  					defaultValue={ssIds && ssIds.one && ssIds.one.securityKey}
	  					ref={securityKeyOne => (this.securityKeyOne = securityKeyOne)}
	  					className="form-control"
	  					placeholder="Security Key"
	  				/>
	  			</Col>
	  		</Row>
	  		<h4 className="page-header">SSID #2</h4>
	  		<Row>
	  			<Col xs={6}>
	  				<ControlLabel>SSID</ControlLabel>
	  				<input
	  					type="text"
	  					name="ssidTwo"
	  					defaultValue={ssIds && ssIds.two && ssIds.two.ssid}
	  					ref={ssidTwo => (this.ssidTwo = ssidTwo)}
	  					className="form-control"
	  					placeholder="Wi-Fi SSID"
	  				/>
	  			</Col>
	  			<Col xs={6}>
						<ControlLabel>Security Key</ControlLabel>
						<input
	  					type="text"
	  					name="securityKeyTwo"
	  					defaultValue={ssIds && ssIds.two && ssIds.two.securityKey}
	  					ref={securityKeyTwo => (this.securityKeyTwo = securityKeyTwo)}
	  					className="form-control"
	  					placeholder="Security Key"
	  				/>
	  			</Col>
	  		</Row>
	  		<h4 className="page-header">SSID #3</h4>
	  		<Row>
	  			<Col xs={6}>
	  				<FormGroup>
	    				<ControlLabel>SSID</ControlLabel>
	    				<input
	    					type="text"
	    					name="ssidThree"
	    					defaultValue={ssIds && ssIds.three && ssIds.three.ssid}
	    					ref={ssidThree => (this.ssidThree = ssidThree)}
	    					className="form-control"
	    					placeholder="Wi-Fi SSID"
	    				/>
	    			</FormGroup>
	  			</Col>
	  			<Col xs={6}>
						<FormGroup>
							<ControlLabel>Security Key</ControlLabel>
							<input
	    					type="text"
	    					name="securityKeyThree"
	    					defaultValue={ssIds && ssIds.three && ssIds.three.securityKey}
	    					ref={securityKeyThree => (this.securityKeyThree = securityKeyThree)}
	    					className="form-control"
	    					placeholder="Security Key"
	    				/>
	    			</FormGroup>
	  			</Col>
	  		</Row>
	  		<Button type="submit" bsStyle="success">Save</Button>
			</form>
    </div>);
  }
}

CustomerWifiForm.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default CustomerWifiForm;
