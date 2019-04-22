import {call} from "../src/Client";
import { provideService } from "../src/Service";
import Mock = jest.Mock;
jest.mock('../src/Client');

describe('mock', () => {
  it('should work with the actual dependency', () => {
    (call as Mock).mockResolvedValue('mocked response');
    return expect(provideService()).resolves.toEqual('api returned mocked response');
  });
});