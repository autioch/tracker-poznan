/* eslint-env mocha */
import { expect } from 'chai';

import optimizeShapeGroup from './optimizeShapeGroup.mjs';

describe('Optimize shape group', () => {
  it('empty array', () => {
    const input = [];
    const expected = [];
    const output = optimizeShapeGroup(input);

    expect(output).to.deep.equal(expected);
  });

  describe('Single shape', () => {
    it('simple shape', () => {
      const input = [ [ [1, 2], [2, 3] ] ];
      const expected = [ [ [1, 2], [2, 3] ] ];
      const output = optimizeShapeGroup(input);

      expect(output).to.deep.equal(expected);
    });

    it('shape with simple duplicate at start', () => {
      const input = [ [ [1, 2], [2, 3], [1, 2], [3, 4], [2, 3], [6, 6] ] ];
      const expected = [ [ [1, 2], [2, 3] ], [ [1, 2], [3, 4], [2, 3], [6, 6] ] ];
      const output = optimizeShapeGroup(input);

      expect(output).to.deep.equal(expected);
    });

    it('shape with long duplicate at start', () => {
      const input = [ [ [1, 2], [2, 3], [3, 4], [2, 3], [1, 2], [4, 5], [3, 4], [2, 3], [6, 6] ] ];
      const expected = [ [ [1, 2], [2, 3], [3, 4] ], [ [1, 2], [4, 5], [3, 4] ], [ [2, 3], [6, 6] ] ];
      const output = optimizeShapeGroup(input);

      expect(output).to.deep.equal(expected);
    });

    it('shape with simple duplicate in the middle', () => {
      const input = [ [ [1, 2], [2, 3], [3, 4], [2, 3], [6, 6] ] ];
      const expected = [ [ [1, 2], [2, 3], [3, 4] ], [ [2, 3], [6, 6] ] ];
      const output = optimizeShapeGroup(input);

      expect(output).to.deep.equal(expected);
    });

    it('shape with long duplicate in the middle', () => {
      const input = [ [ [1, 2], [2, 3], [3, 4], [4, 5], [3, 4], [2, 3], [6, 6] ] ];
      const expected = [ [ [1, 2], [2, 3], [3, 4], [4, 5] ], [ [2, 3], [6, 6] ] ];
      const output = optimizeShapeGroup(input);

      expect(output).to.deep.equal(expected);
    });

    it('shape with simple duplicate at the end', () => {
      const input = [ [ [1, 2], [2, 3], [3, 4], [2, 3] ] ];
      const expected = [ [ [1, 2], [2, 3], [3, 4] ] ];
      const output = optimizeShapeGroup(input);

      expect(output).to.deep.equal(expected);
    });

    it('shape with long duplicate at the end', () => {
      const input = [ [ [1, 2], [2, 3], [3, 4], [4, 5], [3, 4], [2, 3] ] ];
      const expected = [ [ [1, 2], [2, 3], [3, 4], [4, 5] ] ];
      const output = optimizeShapeGroup(input);

      expect(output).to.deep.equal(expected);
    });

    it('mirrored', () => {
      const input = [ [ [1, 2], [2, 3], [3, 4], [4, 5], [3, 4], [2, 3], [1, 2] ] ];
      const expected = [ [ [1, 2], [2, 3], [3, 4], [4, 5] ] ];
      const output = optimizeShapeGroup(input);

      expect(output).to.deep.equal(expected);
    });
  });

  describe('Two shapes', () => {
    it('exlusive', () => {
      const input = [
        [ [1, 2], [2, 3] ],
        [ [3, 4], [2, 3] ]
      ];
      const expected = [
        [ [1, 2], [2, 3] ],
        [ [3, 4], [2, 3] ]
      ];
      const output = optimizeShapeGroup(input);

      expect(output).to.deep.equal(expected);
    });

    it('identical', () => {
      const input = [
        [ [1, 2], [2, 3] ],
        [ [1, 2], [2, 3] ]
      ];
      const expected = [
        [ [1, 2], [2, 3] ]
      ];
      const output = optimizeShapeGroup(input);

      expect(output).to.deep.equal(expected);
    });

    it('second inclusive at start', () => {
      const input = [
        [ [1, 2], [2, 3], [3, 4] ],
        [ [1, 2], [2, 3] ]
      ];
      const expected = [
        [ [1, 2], [2, 3], [3, 4] ]
      ];
      const output = optimizeShapeGroup(input);

      expect(output).to.deep.equal(expected);
    });

    it('second inclusive in the middle', () => {
      const input = [
        [ [1, 2], [2, 3], [3, 4], [4, 5] ],
        [ [2, 3], [3, 4] ]
      ];
      const expected = [
        [ [1, 2], [2, 3], [3, 4], [4, 5] ]
      ];
      const output = optimizeShapeGroup(input);

      expect(output).to.deep.equal(expected);
    });

    it('second inclusive in the end', () => {
      const input = [
        [ [1, 2], [2, 3], [3, 4], [4, 5] ],
        [ [2, 3], [3, 4] ]
      ];
      const expected = [
        [ [1, 2], [2, 3], [3, 4], [4, 5] ]
      ];
      const output = optimizeShapeGroup(input);

      expect(output).to.deep.equal(expected);
    });

    it('first inclusive at start', () => {
      const input = [
        [ [1, 2], [2, 3] ],
        [ [1, 2], [2, 3], [3, 4] ]
      ];
      const expected = [
        [ [1, 2], [2, 3] ],
        [ [2, 3], [3, 4] ]
      ];
      const output = optimizeShapeGroup(input);

      expect(output).to.deep.equal(expected);
    });

    it('first inclusive in the middle', () => {
      const input = [
        [ [2, 3], [3, 4] ],
        [ [1, 2], [2, 3], [3, 4], [4, 5] ]
      ];
      const expected = [
        [ [2, 3], [3, 4] ],
        [ [1, 2], [2, 3] ],
        [ [3, 4], [4, 5] ]
      ];
      const output = optimizeShapeGroup(input);

      expect(output).to.deep.equal(expected);
    });

    it('first inclusive in the end', () => {
      const input = [
        [ [3, 4], [4, 5] ],
        [ [1, 2], [2, 3], [3, 4], [4, 5] ]
      ];
      const expected = [
        [ [3, 4], [4, 5] ],
        [ [1, 2], [2, 3], [3, 4] ]
      ];
      const output = optimizeShapeGroup(input);

      expect(output).to.deep.equal(expected);
    });
  });
});
