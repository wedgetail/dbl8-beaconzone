import React from 'react';
import PropTypes from 'prop-types';

import './ToggleSwitch.scss';

class ToggleSwitch extends React.Component {
  constructor(props) {
    super(props);
    const initialToggledState = props.toggled;
    this.state = { toggled: initialToggledState };
    this.toggleSwitch = this.toggleSwitch.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ toggled: nextProps.toggled });
  }

  toggleSwitch(event) {
    event.stopPropagation();
    const toggled = !this.state.toggled;
    this.setState({ toggled });
    this.refs.checkbox.checked = toggled;
    this.props.onToggle(this.props.id, toggled);
  }

  render() {
    const { onLabel, offLabel } = this.props;
    const { toggled } = this.state;
    return (<div
      className={ `ToggleSwitch ${toggled ? 'yes' : 'no'}` }
      onClick={ this.toggleSwitch }
    >
      <input ref="checkbox" type="checkbox" hidden defaultChecked={ toggled } />
      <div className="handle">
        <span className="handle-label">
          { toggled ? onLabel || 'On' : offLabel || 'Off' }
        </span>
      </div>
    </div>);
  }
}

ToggleSwitch.propTypes = {
  id: PropTypes.string,
  toggled: PropTypes.bool,
  onLabel: PropTypes.string,
  offLabel: PropTypes.string,
  onToggle: PropTypes.func,
};

export default ToggleSwitch;
