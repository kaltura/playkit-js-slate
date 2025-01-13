[![Build Status](https://app.travis-ci.com/kaltura/playkit-js-slate.svg?branch=master)](https://app.travis-ci.com/kaltura/playkit-js-slate)
[![](https://img.shields.io/npm/v/@playkit-js/slate/latest.svg)](https://www.npmjs.com/package/@playkit-js/slate)
[![](https://img.shields.io/npm/v/@playkit-js/slate/canary.svg)](https://www.npmjs.com/package/@playkit-js/slate/v/canary)

# playkit-js-slate

playkit-js-slate is a [kaltura player] plugin that groups several UI services,
in order to simplify and facilitate the customization of the [kaltura player] UI by providing a simple and clean API.

Each service manages a different area of UI functionality.

It relies on [kaltura player] core API for managing UI features.

playkit-js-slate is written in [ECMAScript6] (`*.js`) and [TypeScript] (`*.ts`) (strongly typed superset of ES6),
and transpiled in ECMAScript5 using [Babel](https://babeljs.io/) and the [TypeScript compiler].

[Webpack] is used to build the distro bundle and serve the local development environment.

[kaltura player]: https://github.com/kaltura/kaltura-player-js.
[ecmascript6]: https://github.com/ericdouglas/ES6-Learning#articles--tutorials
[typescript]: https://www.typescriptlang.org/
[typescript compiler]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
[webpack]: https://webpack.js.org/

## Features

Slate plugin allows to inject a slate to the player UI, using its API.

## services

- ### Slate Manager

  Manages and controls the slate, including:

  - Adding a slate
  - Removing a slate

## Getting Started

### Prerequisites

The plugin requires [Kaltura Player] to be loaded first.

[kaltura player]: https://github.com/kaltura/kaltura-player-js

### Installing

First, clone and run [yarn] to install dependencies:

[yarn]: https://yarnpkg.com/lang/en/

```
git clone https://github.com/kaltura/playkit-js-slate.git
cd playkit-js-slate
yarn install
```

### Building

Then, build the plugin

```javascript
yarn run build
```

### Testing

The plugin uses `cypress` tool for e2e tests

```javascript
yarn run test
```

UI conf file (`cypress/public/ui-conf.js`) contains Kaltura player and plugin dependencies.
Keep Kaltura player and dependency versinos aligned to currently released versions.

### Embed the library in your test page

Finally, add the bundle as a script tag in your page, and initialize the player

```html
<script type="text/javascript" src="/PATH/TO/FILE/kaltura-player.js"></script>
<!--Kaltura player-->
<script type="text/javascript" src="/PATH/TO/FILE/playkit-slate.js"></script>
<!--PlayKit info plugin-->
<div id="player-placeholder" style="height:360px; width:640px">
  <script type="text/javascript">
    var playerContainer = document.querySelector("#player-placeholder");
    var config = {
     ...
     targetId: 'player-placeholder',
     plugins: {
       slate: {}
     }
     ...
    };
    var player = KalturaPlayer.setup(config);
    player.loadMedia(...);
  </script>
</div>
```

## Documentation

- [API doc](./docs/api.md)

## Demo

[https://kaltura.github.io/playkit-js-slate/demo/index.html](https://kaltura.github.io/playkit-js-slate/demo/index.html)

## Compatibility

playkit-js-slate is only compatible with browsers supporting MediaSource extensions (MSE) API with 'video/MP4' mime-type inputs.

playkit-js-slate is supported on:

- Chrome 39+ for Android
- Chrome 39+ for Desktop
- Firefox 41+ for Android
- Firefox 42+ for Desktop
- IE11 for Windows 8.1+
- Edge for Windows 10+
- Safari 8+ for MacOS 10.10+
- Safari for ipadOS 13+

## License

playkit-js-slate is released under [Apache 2.0 License](LICENSE)

