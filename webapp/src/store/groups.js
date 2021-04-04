import icons from '../icons';
import biedronka from './data/biedronka.json';
import inpost from './data/inpost.json';
import lidl from './data/lidl.json';
import pharmacy from './data/pharmacy.json';
import routeLines from './data/routeLines.json';
import stops from './data/stops.json';
import zabka from './data/zabka.json';

const forTram = ({ isForTram }) => isForTram;
const forMpkBus = ({ isForMpkBus }) => isForMpkBus;
const forOtherBus = ({ isForOtherBus }) => isForOtherBus;

export const transport = [
  {
    id: 'commune_tram',
    label: 'Tram',
    items: stops.filter(forTram),
    measureCount: 4,
    color: '#F0F',
    iconRound: icons.tram,
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
    rangesKey: 'otherBuses',
    routeLines: routeLines.filter(forOtherBus)
  }
];

export const shops = [
  {
    id: 'lidl',
    label: 'Lidl',
    items: lidl,
    measureCount: 2,
    color: '#0050AA',
    iconRound: icons.lidl
  },
  {
    id: 'biedronka',
    label: 'Biedronka',
    items: biedronka,
    measureCount: 2,
    color: '#E30713',
    iconRound: icons.biedronka
  }
];

export const misc = [
  {
    id: 'zabka',
    label: 'Żabka',
    items: zabka,
    measureCount: 2,
    color: '#01672C',
    iconRound: icons.zabka,
    isMeasured: true
  },
  {
    id: 'inpost',
    label: 'Inpost',
    items: inpost,
    measureCount: 1,
    color: '#000000',
    iconRound: icons.inpost
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    items: pharmacy,
    measureCount: 2,
    color: '#007F0E',
    iconRound: icons.pharmacy
  }
];
