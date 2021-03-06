import React, { Component, PropTypes } from 'react';
import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Grid, Row, Col, Label, Button, }  from 'react-bootstrap';
import _ from 'lodash';
import {
  selectIndicator,
  fetchRegions,
} from '../actions.jsx';


class IndicatorItem extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !_.isEqual(this.props, nextProps);
  // }

  render() {
    return (
      <div
        onClick={() => {
          this.props.dispatch(selectIndicator(this.props));
          this.props.dispatch(fetchRegions(this.props.boundaryTypeName));
        }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          color: '#fff',
          backgroundColor: ((this.props.selected === true) ? '#1F385E' : '#8795AC'),
          padding: '20px 20px 20px 20px',
          margin: 0,
          cursor: 'pointer',
          borderBottom: '1px solid #829DBC',
      }}>
        <div style={{width: 200}}>
          <p>{this.props.name}</p>
          <p style={{fontSize:'0.8em', lineHeight:'0.2em'}}><i className="fa fa-globe"></i>&nbsp;{this.props.regionName}</p>
        </div>
        <div>{Math.round(this.props.series[this.props.series.length-1].score)}</div>
        <div>
          <Label bsStyle='success'>+ {this.props.series[this.props.series.length-1].value}</Label>
        </div>
      </div>
    );
  }
}

IndicatorItem.propTypes = {};

export default IndicatorItem;
