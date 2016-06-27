import guid from './lib/guid.jsx';
import { combineReducers } from 'redux';
import {
  SELECT_INDICATOR,
  TOGGLE_INDICATOR,
  RECEIVE_INDICATORS,
  REQUEST_INDICATORS,
  REQUEST_REGIONS,
  RECEIVE_REGIONS,
  SET_DATERANGE_FOR_PI,
} from './actions.jsx';

function indicators(state = {
  isFetching: false,
  didInvalidate: false,
  piData: [],
  regions: [],
  indicators: [],
  zoomlevel: 'DISTRICT',
}, action) {
  // console.log('reducer indicators() was called with state', state, 'and action', action);
  switch (action.type) {
  case SET_DATERANGE_FOR_PI:
    return Object.assign({}, state, {
      indicators: state.indicators.map((item) => {
        return {
          name: item.name,
          regions: item.regions.map((region) => {
            if (region.id === action.selectedIndicatorItem.id && region.active === true) {
              region.daterange = action.rangeType;
            }
            return region;
          }),
        };
      }),
    });
  case SELECT_INDICATOR:
    return Object.assign({}, state, {
      indicators: state.indicators.map((item) => {
        return {
          name: item.name,
          regions: item.regions.map((region) => {
            if (region.id === action.indicator.id) {
              region.selected = true;
              return region;
            }
            region.selected = false;
            return region;
          }),
        };
      }),
    });
  case TOGGLE_INDICATOR:
    return Object.assign({}, state, {
      indicators: state.indicators.map((item) => {
        return {
          name: item.name,
          regions: item.regions.map((region) => {
            if (region.id === action.indicator.id) {
              if (region.active) {
                region.active = false;
              }
              else {
                region.active = true;
              }
            }
            return region;
          }),
        };
      }),
    });
  case REQUEST_REGIONS:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_REGIONS:
    console.log('action.regions', action.regions);
    return Object.assign({}, state, {
      isFetching: false,
      regions: action.regions,
    });
  case REQUEST_INDICATORS:
    return Object.assign({}, state, {
      isFetching: true,
    });
  case RECEIVE_INDICATORS:
    return Object.assign({}, state, {
      isFetching: false,
      indicators: action.piData.map((item) => {
        return {
          name: item[0].name,
          regions: item[1].regions.map((region) => {
            return {
              name: item[0].name,
              id: guid(),
              aggregationPeriod: item[0].aggregation_period,
              boundaryTypeId: item[0].boundary_type_id,
              boundaryTypeName: item[0].boundary_type_name,
              referenceValue: item[0].reference_value,
              regionName: region.region_name,
              regionUrl: region.region_url,
              series: region.aggregations,
              daterange: '3M',
            };
          }),
        };
      }),
      zoomlevels: action.zoomlevels,
    });
  default:
    return state;
  }
}

const rootReducer = combineReducers({
  indicators,
});

export default rootReducer;
