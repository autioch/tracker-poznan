/* eslint-env mocha */
/* eslint-disable object-curly-newline, object-property-newline*/
import { expect } from 'chai';

import generateRanges from './generateRanges.mjs';

const modeList = [100];
const arcCount = 4;

describe('Generate ranges', () => {
  it('accepts two distant items', () => {
    const input = [
      { longitude: 17, latitude: 52 },
      { longitude: 18, latitude: 53 }
    ];
    const expected = [
      [
        100,
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  // [17.00000000000001, 52.00089831528413],
                  [16.998540894111464, 51.99999999098647],
                  [17.00000000000001, 51.99910168471588],
                  [17.001459105888557, 51.99999999098647],
                  [17.00000000000001, 52.00089831528413],
                  [16.998540894111464, 51.99999999098647]
                ]
              ],
              [
                [
                  // [18, 53.00089831528412],
                  [17.998507323264732, 52.999999990654764],
                  [18, 52.99910168471589],
                  [18.001492676735268, 52.999999990654764],
                  [18, 53.00089831528412],
                  [17.998507323264732, 52.999999990654764]
                ]
              ]
            ]
          }
        }
      ]
    ];

    const output = generateRanges(input, modeList, arcCount);

    expect(output).to.deep.equal(expected);
  });

  it('accepts two identical items', () => {
    const input = [
      { longitude: 17, latitude: 52 },
      { longitude: 17, latitude: 52 }
    ];
    const expected = [
      [
        100,
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [16.998540894111464, 51.99999999098647],
                [17.00000000000001, 51.99910168471588],
                [17.001459105888557, 51.99999999098647],
                [17.00000000000001, 52.00089831528413],
                [16.998540894111464, 51.99999999098647]
              ]
            ]
          }
        }
      ]
    ];

    const output = generateRanges(input, modeList, arcCount);

    expect(output).to.deep.equal(expected);
  });

  it('accepts two intersected items', () => {
    const input = [
      { longitude: 17.00000000000001, latitude: 52.00000000000001 },
      { longitude: 17.00000000000002, latitude: 52.00000000000002 }
    ];
    const expected = [
      [
        100,
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [16.998540894111464, 51.99999999098647],
                [17.00000000000001, 51.99910168471588],
                [17.001459105888557, /* , 51.99999999098647],
                [17.001459105888536, 51.99999999098648],
                [17.001459105888557, */ 51.999999990986495],
                [17.00000000000001, 52.000898315284154],
                [16.998540894111464, /* 51.999999990986495],
                [16.998540894111485, 51.99999999098648],
                [16.998540894111464, */ 51.99999999098647]
              ]
            ]
          }
        }
      ]
    ];

    const output = generateRanges(input, modeList, arcCount);

    expect(output).to.deep.equal(expected);
  });

  it('accepts two intersected items and 2 separate items', () => {
    const input = [
      { longitude: 17.00000000000001, latitude: 52.00000000000001 },
      { longitude: 17.00000000000002, latitude: 52.00000000000002 },
      { longitude: 17.10000000000000, latitude: 52.1000000000000 },
      { longitude: 17.50000000000000, latitude: 52.5000000000000 }
    ];
    const expected = [
      [
        100,
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiPolygon',
            coordinates: [ [
              [
                [16.998540894111464, 51.99999999098647],
                [17.00000000000001, 51.99910168471588],
                [17.001459105888557, /* 51.99999999098647],
                [17.001459105888536, 51.99999999098648],
                [17.001459105888557, */51.999999990986495],
                [17.00000000000001, 52.000898315284154],
                [16.998540894111464, /* 51.999999990986495],
                [16.998540894111485, 51.99999999098648],
                [16.998540894111464, */51.99999999098647]
              ]
            ],
            [
              [
                // [17.100000000000005, 52.100898315284134],
                [17.098537625057794, 52.099999990953975],
                [17.100000000000005, 52.09910168471588],
                [17.10146237494222, 52.099999990953975],
                [17.100000000000005, 52.100898315284134],
                [17.098537625057794, 52.099999990953975]
              ]
            ],
            [
              [
                // [17.500000000000007, 52.500898315284125],
                [17.498524355780127, 52.49999999082251],
                [17.500000000000007, 52.49910168471589],
                [17.50147564421986, 52.49999999082251],
                [17.500000000000007, 52.500898315284125],
                [17.498524355780127, 52.49999999082251]
              ]
            ]
            ]
          }
        }
      ]
    ];

    const output = generateRanges(input, modeList, arcCount);

    expect(output).to.deep.equal(expected);
  });
});
