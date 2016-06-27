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
                   margin={{ top: 20, right: 20, left: -30, bottom: 0 }}>
         <XAxis dataKey="date" tickFormatter={(tick) => {
             const d = new Date(tick);
             const options = { year: '2-digit', month: 'numeric'};
             return `${d.toLocaleDateString('nl-NL', options)}`;
           }} />
         <YAxis yAxisId="left" stroke="#ccc" domain={[0,10]} />
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
      <Grid fluid>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} style={{ height: 300, overflow: 'scroll', padding: 0}}>
            {activeIndicatorItems}
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} style={{height:275, padding:'10px 10px 45px 10px'}}>
            <ul className='list-unstyled list-inline pull-right'>
              <li style={{
                  cursor: 'pointer',
                }}>
                <Button bsSize='xs'>
                  <i className="fa fa-cog"></i>&nbsp;Instellingen
                </Button>
              </li>
            </ul>
            <ul className='list-unstyled list-inline'>
              <li style={{
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}>1Y
              </li>
              <li style={{
                  cursor: 'pointer',
                }}>6M
              </li>
              <li style={{
                  cursor: 'pointer',
                }}>3M
              </li>
              <li style={{
                  cursor: 'pointer',
                }}>1M
              </li>
              <li style={{
                  cursor: 'pointer',
                }}>1D
              </li>
            </ul>
            {chart}
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} style={{
               padding: '10px 5px 10px 5px',
            }}>
            <Button
              className='pull-right'
              onClick={this.props.handleShowConfiguration}
              bsSize="sm">
              <i className="fa fa-sm fa-plus-circle"></i>&nbsp;Toevoegen/verwijderen
            </Button>
            <ButtonToolbar>
              <ButtonGroup bsSize="small">
                <Button active={(this.state.chartOrMap === 'chart') ? true : false}
                  onClick={() => this._handleChartOrMap('chart')}>Grafiek</Button>
                <Button active={(this.state.chartOrMap === 'map') ? true : false}
                  onClick={() => this._handleChartOrMap('map')}>Kaart</Button>
              </ButtonGroup>
            </ButtonToolbar>
          </Col>
        </Row>
      </Grid>
   );
  }
}

IndicatorUI.propTypes = {};

export default IndicatorUI;
