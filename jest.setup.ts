globalThis.IS_REACT_ACT_ENVIRONMENT = true;

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.clearAllMocks();
  jest.clearAllTimers();
});
