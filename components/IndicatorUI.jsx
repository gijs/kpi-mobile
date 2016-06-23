import React, { Component, PropTypes } from 'react';
import IndicatorItem from './IndicatorItem.jsx';
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
import { Grid, Row, Col, Label, Button, ButtonToolbar, ButtonGroup }  from 'react-bootstrap';
import _ from 'lodash';

class IndicatorUI extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chartOrMap: 'chart',
    };
    this._handleChartOrMap = this._handleChartOrMap.bind(this);
  }

  componentDidMount() {
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !_.isEqual(this.props, nextProps);
  // }

  _handleChartOrMap(type) {
    this.setState({
      chartOrMap: type,
    });
  }

  render() {

    const activeIndicatorItems = this.props.indicators.indicators.map((indicator) => {
      return indicator.regions.map((region) => {
        if (region.active) {
          return <IndicatorItem
            dispatch={this.props.dispatch}
            {...region} />;
        }
      })
    });

    const indicatorItems = this.props.indicators.indicators.map((indicator) => {
      return indicator.regions.filter((region) => {
        if (region.selected === true && region.active === true) return region;
      });
    });

    const selectedIndicatorItem = indicatorItems.filter((i) => {
      if (i.length > 0) return i;
    });

    const linedata = (selectedIndicatorItem.length > 0) ? selectedIndicatorItem[0][0].series : [];

    const chart = (selectedIndicatorItem.length > 0) ?
      <ResponsiveContainer>
        <ComposedChart
                   height={320}
                   data={linedata}
                   margin={{ top: 10, right: 20, left: -30, bottom: 0 }}>
         <XAxis dataKey="date" />
         <YAxis yAxisId="left" stroke="#ccc" />
         <CartesianGrid strokeDasharray="3 3"/>
         <Tooltip/>
         <Area type="monotone"
               yAxisId="left"
               dataKey="score"
               fill="#82ca9d"
               stroke="#fff"
               isAnimationActive={false}
               dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer> :
      <div/>
      ;

    return (
      <div style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
        <div style={{
            backgroundColor: '#829DBC',
            borderRadius: 5,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            height: 400,
            marginBottom: 15,
            overflow: 'scroll',
            padding: 0,
            width: '100%',
          }}>
          {activeIndicatorItems}
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#829DBC',
            height: '200',
            overflow: 'hidden',
            borderRadius: 5,
            padding: 20,
            color: '#fff',
            marginBottom: 5,
          }}>

          <ul className='list-unstyled list-inline'>
            <li style={{ fontWeight: 'bold' }}>1Y</li>
            <li>6M</li>
            <li>3M</li>
            <li>1M</li>
            <li>1D</li>
            <li><i className="fa fa-cog"></i></li>
          </ul>
          {chart}
        </div>
        <div style={{
            display: 'flex',
            backgroundColor: 'transparent',
            justifyContent: 'space-between',
            height: '50',
            overflow: 'hidden',
            padding: 3,
            color: '#1F385E',
            cursor: 'pointer',
          }}>
          <div>
          <ButtonToolbar>
            <ButtonGroup bsSize="small">
              <Button active={(this.state.chartOrMap === 'chart') ? true : false}
                onClick={() => this._handleChartOrMap('chart')}>Grafiek</Button>
              <Button active={(this.state.chartOrMap === 'map') ? true : false}
                onClick={() => this._handleChartOrMap('map')}>Kaart</Button>
            </ButtonGroup>
          </ButtonToolbar>
          </div>
          <div>
          <Button
            onClick={this.props.handleShowConfiguration}
            bsSize="sm">
            <i className="fa fa-sm fa-plus-circle"></i>&nbsp;Toevoegen/verwijderen
          </Button>
          </div>
        </div>
      </div>
   );
  }
}

IndicatorUI.propTypes = {};

export default IndicatorUI;
