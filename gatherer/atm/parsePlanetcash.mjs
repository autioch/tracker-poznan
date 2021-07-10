import { require } from '../utils.mjs'; // eslint-disable-line no-shadow

export default function parsePlanetCash() {
  const items = require('./atm/manual/planetcash.json');

  // props:
  // bank - organization
  // code - id?
  // desc - description
  // desc2 - description
  // shop - ?
  // poco - postal code
  // city
  // stet - street
  // buno - building number
  // lat
  // lng
  // out  - ?, true
  // rem  - ?, true/false
  // gsm  - ?, true/false
  // dcc  - ?, true/false
  // eur  - ?, true/false
  // bio  - ?, true/false
  // bio  - ?, true/false
  // h00  - ?, true/false
  // h01  - ?, true/false
  // h24  - ?, true/false
  // dri  - ?, true/false
  // tra  - ?, true/false
  // beg  - ?, time
  // end  - ?, time

  return items.map(({ code, city, lat, lng, stet, buno, desc, desc2 }) => ({
    id: code,
    label: desc,
    address: [stet, buno].filter(Boolean).join(' ').trim(),
    city,
    longitude: parseFloat(lng),
    latitude: parseFloat(lat),
    popupLines: [desc2].filter(Boolean)
  }));
}
