import React, { Component, PropTypes } from 'react';
import zoomlevelLookup from './zoomlevelLookup.jsx';
import IndicatorItem from './IndicatorItem.jsx';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Map, TileLayer, Popup } from 'react-leaflet';
import GeoJsonUpdatable from '../lib/GeoJsonUpdatable.jsx';
import d3 from 'd3';
import { Grid, Row, Col, Label, Modal, Button, ButtonToolbar, ButtonGroup }  from 'react-bootstrap';
import _ from 'lodash';

import {
  setDaterangeForPI,
} from '../actions.jsx';

function getColor(d) {
  return d > 10 ? '#800026' :
    d > 8 ? '#BD0026' :
    d > 6 ? '#E31A1C' :
    d > 4 ? '#FC4E2A' :
    d > 2 ? '#FD8D3C' :
    d > 1 ? 'rgb(86,221,84)' :
    'grey';
}

class IndicatorUI extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chartOrMap: 'chart',
      width: window.innerWidth,
      height: window.innerHeight,
      showModal: false,
      zoomlevel: undefined,
    };
    this._handleChartOrMap = this._handleChartOrMap.bind(this);
    this._setZoomlevel = this._setZoomlevel.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
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

  _setZoomlevel(zoomlevel) {
    if (zoomlevel === this.state.zoomlevel) {
      this.setState({
        zoomlevel: undefined,
      });
    }
    else {
      this.setState({
        zoomlevel,
      });
    }
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  onEachFeature(feature, layer) {

    const _activeIndicatorItems = _.flattenDeep(this.props.indicators.indicators.map((indicator) => {
      return indicator.regions.filter((region) => {
        if (region.active) {
          return region;
        }
        return false;
      });
    }));

    const selectedIndicatorItem = _activeIndicatorItems.filter((indicator) => {
      if (indicator.selected === true && indicator.active === true) {
        return indicator;
      }
      return false;
    })[0];

    const lastScore = _activeIndicatorItems.map((activeIndicatorItem) => {
      if (activeIndicatorItem.regionName === feature.properties.name &&
          activeIndicatorItem.boundaryTypeName === feature.properties.type) {
            return activeIndicatorItem.series[activeIndicatorItem.series.length - 1].score;
      }
    }).filter(n => {
      if(n) return n;
      return false;
    })[0];

    let weight = 1;
    if (feature.properties.name === selectedIndicatorItem.regionName) {
      weight = 10;
    }
    layer.setStyle({
      color: '#fff',
      opacity: 1,
      weight: weight,
      // fillColor: 'rgb(86,221,84)',
      fillColor: getColor(lastScore),
      fillOpacity: 0.5,
    });

    // console.log('Wijk', feature.properties.name, 'Score', lastScore);
    console.log('%c %s %s', `background: ${getColor(lastScore)}; color: #ffffff`, feature.properties.name, lastScore);

  }

  render() {

    // Filter indicator items for active bool
    const _activeIndicatorItems = _.flattenDeep(this.props.indicators.indicators.map((indicator) => {
      return indicator.regions.filter((region) => {
        if (region.active) {
          return region;
        }
        return false;
      });
    }));

    // Create React elements for each filtered indicator item ^^
    const activeIndicatorItems = _activeIndicatorItems.map((_activeIndicatorItem, i) => {
      return (
        <IndicatorItem
          key={i}
          dispatch={this.props.dispatch}
          {..._activeIndicatorItem}
        />
      );
    });

    const selectedIndicatorItem = _activeIndicatorItems.filter((indicator) => {
      if (indicator.selected === true && indicator.active === true) {
        return indicator;
      }
      return false;
    })[0];

    let daterange = (selectedIndicatorItem) ? selectedIndicatorItem.daterange : '3M';

    let linedata = (selectedIndicatorItem) ? selectedIndicatorItem.series.map((item) => {
        return {
          date: item.date,
          value: item.value,
          score: item.score,
        };
    }) : [];

    if (selectedIndicatorItem) {
      let interval = -3; // 3 months back by default

      switch (selectedIndicatorItem.daterange) {
      case '1M':
        interval = -1;
        break;
      case '3M':
        interval = -3;
        break;
      case '1Y':
        interval = -12;
        break;
      case '5Y':
        interval = -60;
        break;
      }

      const lastDate = new Date(linedata[linedata.length - 1].date);
      const timeBack = d3.time.month.offset(lastDate, interval);

      // const lastScore = linedata[linedata.length - 1].score;
      // const lastValue = linedata[linedata.length - 1].value;

      linedata = linedata.filter((linedataItem) => {
        if (new Date(linedataItem.date) >= timeBack && new Date(linedataItem.date) <= lastDate) {
          return linedataItem;
        }
      });
    }


    const chart = (selectedIndicatorItem) ?
      <ResponsiveContainer>
        <ComposedChart
                   height={320}
                   data={linedata}
                   margin={{ top: 20, right: 20, left: -30, bottom: 0 }}>
         <XAxis dataKey="date" tickFormatter={(tick) => {
           const d = new Date(tick);
           const options = {
             year: '2-digit',
             month: 'numeric',
           };
           return `${d.toLocaleDateString('nl-NL', options)}`;
         }} />
         <YAxis yAxisId="left" stroke="#ccc" domain={[0, 10]} />
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
      <div/>;


      let zoom = 11;
      if (selectedIndicatorItem && selectedIndicatorItem.boundaryTypeName === 'DISTRICT') {
        zoom = 11;
      } else if (selectedIndicatorItem && selectedIndicatorItem.boundaryTypeName === 'MUNICIPALITY') {
        zoom = 9;
      }

      let initialLocation = {
        lat: 52.3741,
        lng: 5.2032,
        zoom: zoom,
      };
      const position = [initialLocation.lat, initialLocation.lng];

      const map = (
        <Map center={position}
         zoomControl={false}
         zoom={(this.state.zoomlevel) ? this.state.zoomlevel : initialLocation.zoom}
         style={{
           position: 'absolute',
           top: 0,
           left: 0,
           width: this.state.width,
           height: 350,
        }}>
        <TileLayer
          attribution=''
          url='https://{s}.tiles.mapbox.com/v3/nelenschuurmans.l15e647c/{z}/{x}/{y}.png'
        />
        <GeoJsonUpdatable
          data={this.props.indicators.regions.results}
          onEachFeature={this.onEachFeature.bind(this)}
        />
      </Map>
    );

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
                <Button bsSize='xs' onClick={this.open}>
                  <i className="fa fa-cog"></i>&nbsp;Instellingen
                </Button>
              </li>
            </ul>
            <ul className='list-unstyled list-inline'>
              <li
                onClick={() => this.props.dispatch(setDaterangeForPI(selectedIndicatorItem, '5Y'))}
                style={{
                fontWeight: (daterange === '5Y') ? 'bold' : '',
                cursor: 'pointer',
              }}>5Y
              </li>
              <li
                onClick={() => this.props.dispatch(setDaterangeForPI(selectedIndicatorItem, '1Y'))}
                style={{
                fontWeight: (daterange === '1Y') ? 'bold' : '',
                cursor: 'pointer',
              }}>1Y
              </li>
              <li
                onClick={() => this.props.dispatch(setDaterangeForPI(selectedIndicatorItem, '3M'))}
                style={{
                fontWeight: (daterange === '3M') ? 'bold' : '',
                cursor: 'pointer',
              }}>3M
              </li>
              <li
                onClick={() => this.props.dispatch(setDaterangeForPI(selectedIndicatorItem, '1M'))}
                style={{
                display: 'none',
                fontWeight: (daterange === '1M') ? 'bold' : '',
                cursor: 'pointer',
              }}>1M
              </li>
            </ul>
            {(this.state.chartOrMap === 'chart') ? chart : map}
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
                        onClick={() => this._handleChartOrMap('chart')}>Grafiek
                </Button>
                <Button active={(this.state.chartOrMap === 'map') ? true : false}
                        onClick={() => this._handleChartOrMap('map')}>Kaart
                </Button>
              </ButtonGroup>
              {
                (this.state.chartOrMap === 'map') ?
                <ButtonGroup bsSize="small">
                  {this.props.indicators.zoomlevels.map((zoomlevel, i) => {
                      return <Button
                                key={i}
                                active={(this.state.zoomlevel === zoomlevelLookup[zoomlevel].zoomlevel) ? true : false}
                                onClick={() => this._setZoomlevel(zoomlevelLookup[zoomlevel].zoomlevel)}>
                        {zoomlevelLookup[zoomlevel].human_readable}
                      </Button>;
                    }
                  )}
                </ButtonGroup>
                : ''
              }
            </ButtonToolbar>
          </Col>
        </Row>
        <Modal show={this.state.showModal} onHide={this.close}>
         <Modal.Header closeButton>
           <Modal.Title>Instellingen</Modal.Title>
         </Modal.Header>
         <Modal.Body>
           <h4>Referentiewaarde</h4>
           <p></p>
         </Modal.Body>
         <Modal.Footer>
           <Button onClick={this.close}>Toepassen</Button>
         </Modal.Footer>
       </Modal>
      </Grid>
   );
  }
}

IndicatorUI.propTypes = {};

export default IndicatorUI;
