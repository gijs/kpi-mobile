import { connect } from 'react-redux';

import {
  fetchIndicatorsIfNeeded,
} from '../actions.jsx';
import IndicatorUI from './IndicatorUI.jsx';
import ConfigurationUI from './ConfigurationUI.jsx';

import React, { Component, PropTypes } from 'react';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showConfiguration: false,
    };
    this.handleShowConfiguration = this.handleShowConfiguration.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchIndicatorsIfNeeded());
  }

  handleShowConfiguration() {
    this.setState({
      showConfiguration: !this.state.showConfiguration,
    });
  }

  render() {
    if (!this.state.showConfiguration) {
      return <IndicatorUI
              {...this.props}
              handleShowConfiguration={this.handleShowConfiguration}
             />;
    }
    else {
      return <ConfigurationUI
              {...this.props}
              handleShowConfiguration={this.handleShowConfiguration}
             />;
    }
  }
}

App.propTypes = {
  dispatch: PropTypes.func,
};

function mapStateToProps(state) {
  // This function maps the Redux state to React Props.
  return {'indicators': state.indicators};
}

export default connect(mapStateToProps)(App);
