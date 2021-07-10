import fs from 'fs/promises';
import xml2js from 'xml2js';

import { joinFromCurrentDir } from '../../utils/index.mjs';

const join = joinFromCurrentDir(import.meta, 'manual');

function flattenXmlNode(node, parentTagName, nodeIndex) {
  const {
    _attributes_ = {},
    _children_ = [],
    _value_ = ''
  } = node;
  const tagName = node['#name'];

  if (tagName === 'attribute' && _attributes_.key) { // hack for mastercard
    return [ [`attribute#${_attributes_.key}`, _value_] ];
  }

  const tagKey = nodeIndex ? `${nodeIndex}#${tagName}` : tagName;
  const nodeKey = parentTagName ? `${parentTagName} -> ${tagKey}` : tagKey;

  const attrEntries = Object.entries(_attributes_).map(([key2, value2]) => [`${nodeKey}.attr.${key2}`, value2]);
  const childEntries = _children_.flatMap((childNode, childNodeIndex) => flattenXmlNode(childNode, nodeKey, childNodeIndex));

  const props = [...attrEntries, ...childEntries];

  if (_value_) {
    props.push([`${nodeKey}.value`, _value_]);
  }

  return props;
}

export default async function mastercard() {
  const xml = await fs.readFile(join('mastercard.xml'), 'utf8');

  const parser = new xml2js.Parser({
    attrkey: '_attributes_',
    charkey: '_value_',
    childkey: '_children_',
    trim: true,
    normalizeTags: true,
    explicitArray: true,
    explicitChildren: true,
    explicitCharkey: true,
    preserveChildrenOrder: true
  });

  const { locations: { _children_: locations } } = await parser.parseStringPromise(xml);
  const itemList = locations.map((loc) => Object.fromEntries(flattenXmlNode(loc)));

  return itemList.map((item) => ({
    id: item['location.attr.id'],
    label: item['attribute#LOC_NAM'],
    address: item['attribute#ADDR_LINE1'],
    city: item['attribute#CITY_NAM'],
    longitude: parseFloat(item['location -> 4#point.attr.longitude']),
    latitude: parseFloat(item['location -> 4#point.attr.latitude']),
    popupLines: [
      item['attribute#LOCATION_TYPE_DESC'],
      item['attribute#LOC_DESC'],
      item['attribute#OWNR_NAM'],
      item['attribute#SPNSR_NAM'],
      `Max withdrawal: ${[...new Set([
        item['attribute#MAX_WTHDRWL_LIMIT1'],
        item['attribute#MAX_WTHDRWL_LIMIT2'],
        item['attribute#MAX_WTHDRWL_LIMIT3']
      ].filter((val) => val > 0).sort())].join(' or ')}`,
      `Smallest denom: ${[...new Set([
        item['attribute#SMALLEST_DENOM1'],
        item['attribute#SMALLEST_DENOM2'],
        item['attribute#SMALLEST_DENOM3']
      ].filter((val) => val > 0).sort())].join(' or ')}`
    ].filter(Boolean)
  }));
}
