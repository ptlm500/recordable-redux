import defaultActionTypes from './defaultActionTypes';

describe('defaultActionTypes', () => {
  it('has a BACK action type', () => {
    expect(defaultActionTypes.BACK).toBe('BACK');
  });

  it('has a FORWARD action type', () => {
    expect(defaultActionTypes.FORWARD).toBe('FORWARD');
  });

  it('has a TOGGLE_RECORDING action type', () => {
    expect(defaultActionTypes.TOGGLE_RECORDING).toBe('TOGGLE_RECORDING');
  });

  it('has a CLEAR_RECORDING action type', () => {
    expect(defaultActionTypes.CLEAR_RECORDING).toBe('CLEAR_RECORDING');
  });
});
