# tracker-poznan

App for finding interesting areas near your location.

See it at [autioch.github.io/tracker-poznan](https://autioch.github.io/tracker-poznan).

## Features
- configurable list of displayed, mesured and reachable points
  - MPK Poznan communication routes
  - few grocery chain shops
  - pharmacies
  - ATMS
- tracking current location or selecting custom location

## Building
1. Clone this repository.
2. Gather data. In `gatherer` folder:
  - create file `opencagekey.mjs`, which should have contents `export default '<yourkey>';`
  - run `npm i`
  - run `npm run gather`, this will attempt to get up to date data
  - run `npm run parse`, this will parse the data and place it in `docs/data`.
3. Setup webapp. In `webapp` folder:
  - run `npm i`
  - run `npm run start`, this will setup dev verion at `localhost:8080`
  - run `npm run build` to build own version (change publicPath in webpack config)

## What's being used
- https://leafletjs.com
- https://www.openstreetmap.org
- https://www.mapbox.com
- https://opencagedata.com

## What's not being used
- frontend framework, pure vanilla
- database, this was experimental and turns out, jsons are good enough
- open street map database, which could potentially be used

## TODO
- checkout webpack https://www.npmjs.com/package/offline-plugin
- checkout https://developers.google.com/web/tools/workbox/guides/get-started


## Update steps
Those are very raw, will be refined at some point.
1. In folder `gatherer`, run `npm run gather`, then `npm run parse`.
2. In file `webapp/src/modules/about.js`, update `LAST_UPDATE` const.
3. In file `docs/service-worker.js`, update `CACHE_NAME` version. 
