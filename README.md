# react-resizable-decorator

[![Build Status](https://img.shields.io/travis/bokuweb/react-resizable-decorator.svg?style=flat-square)](https://travis-ci.org/bokuweb/react-resizable-decorator)
[![Version](https://img.shields.io/npm/v/react-resizable-decorator.svg?style=flat-square)](https://www.npmjs.com/package/react-resizable-decorator)
[![Code Climate](https://img.shields.io/codeclimate/github/bokuweb/react-resizable-decorator/badges/gpa.svg?style=flat-square)](https://codeclimate.com/github/bokuweb/react-resizable-decorator)
[![License](https://img.shields.io/npm/l/react-resizable-decorator.svg?style=flat-square)](https://github.com/bokuweb/react-resizable-decorator#license)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Development](#development)
- [Test](#test)
- [Contribute](#contribute)
- [Changelog](#changelog)
- [License](#license)

## Install

``` sh
$ npm install --save react-resizable-decorator
```

## Usage

- If you can use `decorator`, (e.g. babel-plugin-transform-decorators-legacy).

``` js
import React, { Component } from 'react';
import resizable from 'react-resizable-decorator';

@resizable
class Hello extends Component {
  render() {
    return (
      <div>Hello</div>
    );
  }
}

export default class Example extends Component {
  render() {
    return (
      <Hello width="100px" height="100px">Hello</Hello>
    );
  }
}
```

- If you can not use `decorator`.

``` js
import React, { Component } from 'react';
import resizable from 'react-resizable-decorator';

const Hello = resizable(class Hello extends Component {
  render() {
    return (
      <div>Hello</div>
    );
  }
});

export default class Example extends Component {
  render() {
    return (
      <Hello width="100px" height="100px">Hello</Hello>
    );
  }
}
```

## Development

``` sh
npm start && open http://localhost:
```

## Test

``` sh
$ npm run test:ci
```

## Contribute

PR welcome.

## Changelog

#### v0.1.0

- First release.

## License

The MIT License (MIT)

Copyright (c) 2017 Bokuweb

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
