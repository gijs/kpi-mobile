/* globals Promise:true */
import $ from 'jquery';
import _ from 'lodash';

export const SELECT_INDICATOR = 'SELECT_INDICATOR';
export const TOGGLE_INDICATOR = 'TOGGLE_INDICATOR';
export const REQUEST_INDICATORS = 'REQUEST_INDICATORS';
export const RECEIVE_INDICATORS = 'RECEIVE_INDICATORS';

export function selectIndicator(indicator) {
  return {
    type: SELECT_INDICATOR,
    indicator,
  };
}

export function toggleIndicator(indicator) {
  return {
    type: TOGGLE_INDICATOR,
    indicator,
  };
}

function requestIndicators() {
  return {
    type: REQUEST_INDICATORS,
  };
}

function receiveIndicators(piData, zoomlevels) {
  return {
    type: RECEIVE_INDICATORS,
    piData,
    zoomlevels,
    receivedAt: Date.now(),
  };
}

export function fetchIndicators() {
  return dispatch => {
    dispatch(requestIndicators());
    const indicatorEndpoint = $.ajax({
      type: 'GET',
      url: 'https://nxt.staging.lizard.net/api/v2/pi/',
      xhrFields: {
        withCredentials: true,
      },
      success: (data) => {
        return data;
      },
    });
    Promise.all([indicatorEndpoint]).then(([indicatorResults]) => {
      // Now, get the details for every PI object
      const urls = indicatorResults.results.map((indicator) => {
        return $.ajax({
          type: 'GET',
          url: `${indicator.url}`,
          xhrFields: {
            withCredentials: true,
          },
        });
      });
      Promise.all(urls).then((details) => {
        // Combine the pi detail with the pi parent
        const piData = _.zip(indicatorResults.results, details);
        const zoomlevels = _.uniq(indicatorResults.results.map((piresult) => {
          return piresult.boundary_type_name;
        }));
        return dispatch(receiveIndicators(piData, zoomlevels));
      });
    });
  };
}

export function fetchIndicatorsIfNeeded() {
  return (dispatch) => {
    return dispatch(fetchIndicators());
  };
}
