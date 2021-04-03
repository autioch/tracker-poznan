/* eslint-env mocha */
const { haversine1: haversine } = require('./index.js');
const { expect } = require('chai');
const testCases = require('./index.testCases');

describe('haversine', () => {
  testCases.forEach(({ x, y, distance }, index) => {
    it(`${index}: calculates valid distance in km for`, () => {
      const result = haversine(x, y);

      expect(result).to.deep.equal(distance);
    });
  });
});
