import biedronka from './data/biedronka.json';
import bus from './data/bus.json';
import busLines from './data/busLines.json';
import chatapolska from './data/chatapolska.json';
import inpost from './data/inpost.json';
import lidl from './data/lidl.json';
import mpkRanges from './data/mpkRanges.json';
import netto from './data/netto.json';
import otherBus from './data/otherBus.json';
import otherBusLines from './data/otherBusLines.json';
import pharmacy from './data/pharmacy.json';
import tram from './data/tram.json';
import tramLines from './data/tramLines.json';
import zabka from './data/zabka.json';
import icons from './icons';

export default [
  {
    id: 'commune_tram',
    label: 'Tram',
    items: tram,
    measureCount: 4,
    color: '#F0F',
    iconUrl: icons.tram,
    routeLines: tramLines,
    category: 'transport',
    ranges: mpkRanges.tramStops
  },
  {
    id: 'commune_bus',
    label: 'Bus',
    items: bus,
    measureCount: 4,
    color: '#FA0',
    iconUrl: icons.bus,
    routeLines: busLines,
    category: 'transport',
    ranges: mpkRanges.mpkBusStops
  },
  {
    id: 'commune_other',
    label: 'Other bus',
    items: otherBus,
    measureCount: 4,
    color: '#333',
    iconUrl: icons.otherBus,
    routeLines: otherBusLines,
    category: 'transport',
    ranges: mpkRanges.otherBusStops
  },
  {
    id: 'lidl',
    label: 'Lidl',
    items: lidl,
    measureCount: 2,
    color: '#0050AA',
    iconUrl: icons.lidl,
    category: 'shop'
  },
  {
    id: 'biedronka',
    label: 'Biedronka',
    items: biedronka,
    measureCount: 2,
    color: '#E30713',
    iconUrl: icons.biedronka,
    category: 'shop'
  },
  {
    id: 'netto',
    label: 'Netto',
    items: netto,
    measureCount: 2,
    color: '#F5D300',
    iconUrl: icons.netto,
    category: 'shop'
  },
  {
    id: 'chatapolska',
    label: 'Chata Polska',
    items: chatapolska,
    measureCount: 2,
    color: '#009846',
    iconUrl: icons.chatapolska,
    category: 'shop'
  },
  {
    id: 'zabka',
    label: 'Żabka',
    items: zabka,
    measureCount: 2,
    color: '#01672C',
    iconUrl: icons.zabka,
    category: 'misc'
  },
  {
    id: 'inpost',
    label: 'Inpost',
    items: inpost,
    measureCount: 1,
    color: '#000000',
    iconUrl: icons.inpost,
    category: 'misc'
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    items: pharmacy,
    measureCount: 2,
    color: '#007F0E',
    iconUrl: icons.pharmacy,
    category: 'misc'
  }
];
