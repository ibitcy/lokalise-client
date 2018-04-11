import { mergeMaps } from '../index';

const mapA = new Map();
mapA.set('one', 1);
mapA.set('two', 2);

const mapB = new Map();
mapB.set('two', 2);
mapB.set('three', 3);

describe('Merge maps', () => {
  it('Check merged map size', () => {
    const merged = mergeMaps([mapA, mapB, null]);
    expect(merged.size).toEqual(3);
  });

  it('Should be empty map', () => {
    const merged = mergeMaps([new Map(), new Map(), new Map(), null]);
    expect(merged.size).toEqual(0);
  });
});
