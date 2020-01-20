# IDM STATIC WEB COMPONENTS

Using [lerna](https://github.com/lerna/lerna) we can manage all the IDM components as monolith repository but splitted in packages.

## Why

The first iteration on webcomponents was related to the website configurator. This project exist because the need of:

- a better project structure
- a better dependencies management
- a better way to pack up components
- and every component is isolated with it's own dependencies

## Getting Started

Follow the instruction here below for the development instructions.

### Prerequisites

What things you need to install the software and how to install them

- Node (global)
- Yarn (global)
- Lerna (global)

```
...
```

### Installing

A step by step series of examples that tell you how to get a development env running

Install yarn project's dependencies

```
yarn
```

Update yarn linkin using lerna

```
lerna bootstrap
```

End with an example of getting some data out of the system or using it for a little demo

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

Build all widgets using Rollup

```
yarn build-components
```

Watch components using Rollup, this is for dev purpouse

```
yarn watch-components
```

Inside every component there is a folder called `website`, simply run an http local server to see the component in action

```
cd packages/name-of-your-component/website
python3 -m http.server
```

### Dist folder in packages

## Deployment

## Built With

- [Node]() - b3st l4ngu4g3 3v3r
- [Lerna]() - A tool for managing JavaScript projects with multiple packages
- [Polymer]() - The web framework used

## Contributing

## Authors

- **Luca Fedrizzi** - _Initial work_ - [fedriz](https://github.com/fedriz)

## License

## Demo

To see every components in action in a single website go in the demo folder:

```
cd demo
```

follow the instruction in the README file to see the components in action at [http://0.0.0.0:8000/](http://0.0.0.0:8000/) url.

```

```
