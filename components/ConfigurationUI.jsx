import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Label, Button, }  from 'react-bootstrap';
import _ from 'lodash';
import {
  toggleIndicator,
} from '../actions.jsx';



class ConfigurationUI extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }

  componentDidMount() {
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !_.isEqual(this.props, nextProps);
  // }

  render() {

    const fields = this.props.indicators.indicators.map((indicator, i) => {
      const filteredRegions = indicator.regions.filter((region) => {
        if (region.regionName && region.regionName.toLowerCase().indexOf(this.state.searchValue.toLowerCase()) > -1) {
          return region;
        }
        return false;
      });

      const regions = filteredRegions.map((region, j) => {
        return <li key={j}
                   onClick={() => this.props.dispatch(toggleIndicator(region))}
                   style={{
                     height: 40,
                     padding: '10px 0 10px 10px',
                     textOverflow: 'ellipsis',
                     overflow: 'hidden',
                     whiteSpace: 'nowrap',
                     fontWeight: (region.active) ? 'bold' : '',
                     backgroundColor: (j % 2 === 0) ? '#122747' : '#1F385E',
                   }}>
                   {(region.active) ? <i className='fa fa-check-circle' style={{color:'#32CD32'}}></i> : ''} {region.regionName}
              </li>;
      });

      return (
        <div key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            margin: '15px 0 0 0',
          }}>
        <div>
          <p style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', margin: '0 0 10px 10px', fontWeight: 'bold', }}>
            <i className="fa fa-table"></i>&nbsp;&nbsp;{indicator.name}
          </p>
        </div>
          <ul className="list-unstyled">
            {regions}
          </ul>
          <div/>
        </div>
      );
    });

    return (
      <div style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1F385E',
          color: '#fff',
        }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 10,
          color: '#fff',
          borderRadius: 5,
          }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              padding: 0,
              fontSize: 12
              }}>
              <div style={{position:'absolute', right: 10}}>
                <Button onClick={this.props.handleShowConfiguration} bsSize='sm' bsStyle='default'>Gereed</Button>
              </div>
            </div>
          </div>
        </div>
        {fields}
      </div>
   );
  }
}

ConfigurationUI.propTypes = {
  handleShowConfiguration: PropTypes.func,
};

export default ConfigurationUI;
