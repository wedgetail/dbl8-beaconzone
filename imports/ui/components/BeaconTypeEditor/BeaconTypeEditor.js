/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Random } from 'meteor/random';
import validate from '../../../modules/validate';

import './BeaconTypeEditor.scss';

const getBlankParseMapField = () => {
  return {
    _id: Random.id(),
    key: '',
    location: 'event',
    start: '',
    end: '',
    parseInt: true,
    radix: 16,
    offset: 0,
    modifier: 'none',
  };
};

class BeaconTypeEditor extends React.Component {
  constructor(props) {
    super(props);
    const existingParseMapFields = props.beaconType && props.beaconType.parseMapFields;
    this.state = {
      parseMapFields: existingParseMapFields && existingParseMapFields.length > 0 ? existingParseMapFields : [getBlankParseMapField()]
    };
  }

  componentDidMount() {
    const component = this;
    validate(component.form, {
      rules: {
        title: {
          required: true,
        },
        beaconTypeCode: {
          required: true,
        },
        description: {
          required: true,
        },
      },
      messages: {
        title: {
          required: 'Need a title in here, Seuss.',
        },
        beaconTypeCode: {
          required: 'Need a beacon type code in here, Seuss.',
        },
        description: {
          required: 'This thneeds a description, please.',
        },
      },
      submitHandler() { component.handleSubmit(); },
    });
  }

  handleSubmit() {
    const { history } = this.props;
    const existingBeaconType = this.props.beaconType && this.props.beaconType._id;
    const methodToCall = existingBeaconType ? 'beaconTypes.update' : 'beaconTypes.insert';
    const beaconType = {
      title: this.title.value.trim(),
      description: this.description.value.trim(),
      beaconTypeCode: this.beaconTypeCode.value.trim(),
      parseMapFields: this.state.parseMapFields.filter((parseMapField) => this.isValidParseMapField(parseMapField)).map((parseMapField) => {
        // NOTE: Convert parseInt to a boolean (select returns 'true' as a string).
        return {
          ...parseMapField,
          parseInt: parseMapField.parseInt === 'true',
        }
      }),
    };

    if (existingBeaconType) beaconType._id = existingBeaconType;

    Meteor.call(methodToCall, beaconType, (error, beaconTypeId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingBeaconType ? 'Beacon type updated!' : 'Beacon type added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/admin/beaconTypes`);
      }
    });
  }

  isValidParseMapField = (parseMapField) => {
    let isValid = true;

    if (parseMapField && parseMapField.key.trim() === '') isValid = false;
    if (parseMapField && parseMapField.start.trim() === '') isValid = false;
    if (parseMapField && parseMapField.end.trim() === '') isValid = false;

    return isValid;
  };

  handleSetParseMapField = (_id, inputName, value) => {
    this.setState(({ parseMapFields }) => {
      const newParseMapFields = [...parseMapFields];
      const parseMapFieldToUpdate = newParseMapFields.find((parseMapField) => parseMapField._id === _id);
      parseMapFieldToUpdate[inputName] = value;

      return {
        parseMapFields: newParseMapFields,
      };
    });
  };

  handleAddParseMapField = () => {
    this.setState(({ parseMapFields }) => {
      return {
        parseMapFields: [...parseMapFields, getBlankParseMapField()],
      };
    })
  };

  handleRemoveParseMapField = (_id) => {
    this.setState(({ parseMapFields }) => {
      return {
        parseMapFields: parseMapFields.filter((parseMapField) => parseMapField._id !== _id),
      };
    })
  };

  render() {
    const { beaconType } = this.props;
    return (
      <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
        <Row>
          <Col xs={12} sm={8}>
            <FormGroup>
              <ControlLabel>Title</ControlLabel>
              <input
                type="text"
                className="form-control"
                name="title"
                ref={title => (this.title = title)}
                defaultValue={beaconType && beaconType.title}
                placeholder="Proximity beacon"
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={4}>
            <FormGroup>
              <ControlLabel>Beacon Type Code</ControlLabel>
              <input
                type="text"
                className="form-control"
                name="beaconTypeCode"
                ref={beaconTypeCode => (this.beaconTypeCode = beaconTypeCode)}
                defaultValue={beaconType && beaconType.beaconTypeCode}
                placeholder="8899"
              />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <textarea
            className="form-control"
            name="description"
            ref={description => (this.description = description)}
            defaultValue={beaconType && beaconType.description}
            placeholder="Basic beacon to measure proximity."
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Custom Parse Map Fields (optional)</ControlLabel>
          <div className="parse-map-fields">
            {this.state.parseMapFields.map(({ _id, key, location, start, end, parseInt, radix, offset, modifier }) => {
              return (
                <Row key={_id}>
                  <Col xs={12} sm={this.state.parseMapFields.length > 1 ? 2 : 3}>
                    <ControlLabel>Key</ControlLabel>
                    <input
                      className="form-control"
                      type="text"
                      name="key"
                      value={key}
                      placeholder="temp"
                      onChange={(event) => this.handleSetParseMapField(_id, 'key', event.target.value)}
                    />
                  </Col>
                  <Col xs={12} sm={2}>
                    <ControlLabel>Location</ControlLabel>
                    <select className="form-control" name="location" value={location} onChange={(event) => this.handleSetParseMapField(_id, 'location', event.target.value)}>
                      <option value="event">Event</option>
                      <option value="packet">Packet</option>
                    </select>
                  </Col>
                  <Col xs={12} sm={1}>
                    <ControlLabel>Start</ControlLabel>
                    <input
                      className="form-control"
                      type="number"
                      min={0}
                      name="start"
                      value={start}
                      onChange={(event) => this.handleSetParseMapField(_id, 'start', event.target.value)}
                    />
                  </Col>
                  <Col xs={12} sm={1}>
                    <ControlLabel>End</ControlLabel>
                    <input
                      className="form-control"
                      type="number"
                      min={0}
                      name="end"
                      value={end}
                      onChange={(event) => this.handleSetParseMapField(_id, 'end', event.target.value)}
                    />
                  </Col>
                  <Col xs={12} sm={1}>
                    <ControlLabel>Parse Int</ControlLabel>
                    <select className="form-control" name="parseInt" value={parseInt} onChange={(event) => this.handleSetParseMapField(_id, 'parseInt', event.target.value)}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </Col>
                  <Col xs={12} sm={1}>
                    <ControlLabel>Radix</ControlLabel>
                    <select className="form-control" name="radix" value={radix} onChange={(event) => this.handleSetParseMapField(_id, 'radix', event.target.value)}>
                      <option value="16">16</option>
                      <option value="10">10</option>
                    </select>
                  </Col>
                  <Col xs={12} sm={1}>
                    <ControlLabel>Offset</ControlLabel>
                    <input
                      className="form-control"
                      type="number"
                      name="offset"
                      value={offset}
                      onChange={(event) => this.handleSetParseMapField(_id, 'offset', event.target.value)}
                    />
                  </Col>
                  <Col xs={12} sm={2}>
                    <ControlLabel>Modifier</ControlLabel>
                    <select className="form-control" name="modifier" value={modifier} onChange={(event) => this.handleSetParseMapField(_id, 'modifier', event.target.value)}>
                      <option value="none">None</option>
                      <option value="centigradeToFarenheit">Cº to Fº</option>
                    </select>
                  </Col>
                  {this.state.parseMapFields.length > 1 && (
                    <Col xs={12} sm={1}>
                      <i className="fa fa-remove" onClick={() => this.handleRemoveParseMapField(_id)} />
                    </Col>
                  )}
                </Row>
              )
            })}
            {this.state.parseMapFields.length >= 1 && this.isValidParseMapField(this.state.parseMapFields[this.state.parseMapFields.length - 1]) && (
              <a href="#" className="add-another-field" onClick={this.handleAddParseMapField}>
                Add Another Field
              </a>
            )}
          </div>
        </FormGroup>
        <Button type="submit" bsStyle="success">
          {beaconType && beaconType._id ? 'Save Changes' : 'Add Beacon Type'}
        </Button>
      </form>
    );
  }
}

BeaconTypeEditor.defaultProps = {
  beaconType: { title: '', description: '' },
};

BeaconTypeEditor.propTypes = {
  beaconType: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default BeaconTypeEditor;
