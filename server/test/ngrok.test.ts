import { checkNgrokInstalled } from '../src/utils';

describe('ngrok validation', () => {
  test('checkNgrokInstalled returns a boolean', () => {
    const result = checkNgrokInstalled();
    expect(typeof result).toBe('boolean');
  });
});
