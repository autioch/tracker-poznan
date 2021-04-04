import L from 'leaflet';

import icons from '../icons';
import biedronkaShops from './data/biedronkaShops.json';
import inposts from './data/inposts.json';
import lidlShops from './data/lidlShops.json';
import pharmacies from './data/pharmacies.json';
import routeLines from './data/routeLines.json';
import stops from './data/stops.json';
import zabkaShops from './data/zabkaShops.json';

const forTram = ({ isForTram }) => isForTram;
const forMpkBus = ({ isForMpkBus }) => isForMpkBus;
const forOtherBus = ({ isForOtherBus }) => isForOtherBus;
const makeIcon = (img, width, height) => L.icon({
  iconUrl: img,
  iconSize: [width, height],
  popupAnchor: [0, -Math.ceil(height / 2)]
});

export const transport = [
  {
    id: 'commune_tram',
    label: 'Tram',
    items: stops.filter(forTram),
    measureCount: 4,
    color: '#F0F',
    iconRound: icons.tram,
    icon: makeIcon(icons.tram, 16, 16, 'tram'),
    rangesKey: 'trams',
    routeLines: routeLines.filter(forTram),
    isMeasured: true
  },
  {
    id: 'commune_bus',
    label: 'Bus',
    items: stops.filter(forMpkBus),
    measureCount: 4,
    color: '#FA0',
    iconRound: icons.bus,
    icon: makeIcon(icons.bus, 16, 16, 'bus'),
    rangesKey: 'mpkBuses',
    routeLines: routeLines.filter(forMpkBus),
    isMeasured: true
  },
  {
    id: 'commune_other',
    label: 'Other bus',
    items: stops.filter(forOtherBus),
    measureCount: 4,
    color: '#333',
    iconRound: icons.otherBus,
    icon: makeIcon(icons.otherBus, 16, 16, 'otherBus'),
    rangesKey: 'otherBuses',
    routeLines: routeLines.filter(forOtherBus)
  }
];

export const bigShops = [

  {
    id: 'lidl',
    label: 'Lidl',
    items: lidlShops,
    measureCount: 2,
    color: '#0050AA',
    iconRound: icons.lidl,
    icon: makeIcon(icons.lidl, 32, 32, 'lidl')
  },
  {
    id: 'biedronka',
    label: 'Biedronka',
    items: biedronkaShops,
    measureCount: 2,
    color: '#E30713',
    iconRound: icons.biedronka,
    icon: makeIcon(icons.biedronka, 32, 48, 'biedronka')
  }
];

export const misc = [
  {
    id: 'zabka',
    label: 'Żabka',
    items: zabkaShops,
    measureCount: 2,
    color: '#01672C',
    iconRound: icons.zabka,
    icon: makeIcon(icons.zabka, 18, 24, 'zabka'),
    isMeasured: true
  },
  {
    id: 'inpost',
    label: 'Inpost',
    items: inposts,
    measureCount: 1,
    color: '#000000',
    iconRound: icons.inpost,
    icon: makeIcon(icons.inpost, 36, 24, 'inpost')
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    items: pharmacies,
    measureCount: 2,
    color: '#007F0E',
    iconRound: icons.pharmacy,
    icon: makeIcon(icons.pharmacy, 24, 24, 'pharmacy')
  }
];
