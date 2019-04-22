import {camelCase} from 'change-case';

describe('hello world', () => {
  it('should greet the parameter', () => {
    expect(camelCase('you-jump')).toEqual('youJump');
  });
});
