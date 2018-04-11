import { unique } from '..';

describe('Get unique array function', () => {

  it('Should return empty array', () => {
    expect(unique<number>([])).toEqual([]);
  });

  it('Should return initial array', () => {
    expect(unique<number>([0])).toEqual([0]);
  });

  it('Should return unique array', () => {
    expect(unique<number>([1, 3, 3])).toEqual([1, 3]);
  });

  it('Should return unique array', () => {
    expect(unique<string>(['foo', 'bar', 'bar'])).toEqual(['foo', 'bar']);
  });

});
