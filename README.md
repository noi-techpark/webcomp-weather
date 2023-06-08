<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->

# IDM STATIC WEB COMPONENTS

![REUSE Compliance](https://github.com/noi-techpark/webcomp-weather/actions/workflows/reuse.yml/badge.svg)
[![CI/CD](https://github.com/noi-techpark/webcomp-weather/actions/workflows/main.yml/badge.svg)](https://github.com/noi-techpark/webcomp-weather/actions/workflows/main.yml)

## Getting Started

Follow the instruction here below for the development instructions.

### Prerequisites

What things you need to install the software and how to install them

- Node (global)
- NPM (global)

### Installing

A step by step series of examples that tell you how to get a development env running

Install npm project's dependencies

```
npm install
```

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
...
```

### And coding style tests

Explain what these tests test and why

```
...
```

## Usage

Build all widget using Rollup:

```
npm run build
```

Watch component using Rollup with dev purpose:

```
npm run start
```

To view the component changes:

```
cd ./work
python3 -m http.server
```

You will see the components in action at [http://0.0.0.0:8000/](http://0.0.0.0:8000/) url.

## Customizations

### Use a custom font

Using the `--webcomp-weather-font-family` css variable you can set a custom `font-family`.
[link to MDN doc](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

```html
<style>
  meteo-widget.en_widget {
    --webcomp-weather-font-family: Metal Mania;
  }
</style>
<meteo-widget class="en_widget" forecast_days="2" language_translation="en"></meteo-widget>
```

### Dist folder in packages

## Deployment

## Built With

- [Node]()
- [Polymer]() - The web framework used

## Contributing

Look the `CONTRIBUTING.md` file.

## Authors

- **Luca Fedrizzi** - _Initial work_ - [fedriz](https://github.com/fedriz)

## License

```

```
