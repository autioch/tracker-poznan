import icons from '../icons';
import biedronka from './data/biedronka.json';
import bus from './data/bus.json';
import busLines from './data/busLines.json';
import inpost from './data/inpost.json';
import lidl from './data/lidl.json';
import netto from './data/netto.json';
import otherBus from './data/otherBus.json';
import otherBusLines from './data/otherBusLines.json';
import pharmacy from './data/pharmacy.json';
import tram from './data/tram.json';
import tramLines from './data/tramLines.json';
import zabka from './data/zabka.json';

export const transport = [
  {
    id: 'commune_tram',
    label: 'Tram',
    items: tram,
    measureCount: 4,
    color: '#F0F',
    iconRound: icons.tram,
    rangesKey: 'tramStops',
    isVisible: true,
    routeLines: tramLines,
    isMeasured: true
  },
  {
    id: 'commune_bus',
    label: 'Bus',
    items: bus,
    measureCount: 4,
    color: '#FA0',
    iconRound: icons.bus,
    rangesKey: 'mpkBusStops',
    routeLines: busLines,
    isMeasured: true
  },
  {
    id: 'commune_other',
    label: 'Other bus',
    items: otherBus,
    measureCount: 4,
    color: '#333',
    iconRound: icons.otherBus,
    rangesKey: 'otherBusStops',
    routeLines: otherBusLines
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
  },
  {
    id: 'netto',
    label: 'Netto',
    items: netto,
    measureCount: 2,
    color: '#F5D300',
    iconRound: icons.netto
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
