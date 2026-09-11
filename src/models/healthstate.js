const healthState = {};


export function updateState(endpointName, result) {
  healthState[endpointName] = result;
}


export function getState() {
  return healthState;
}