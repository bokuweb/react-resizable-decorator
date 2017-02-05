# react-resizable-decorator

[![Build Status](https://img.shields.io/travis/bokuweb/react-resizable-decorator.svg?style=flat-square)](https://travis-ci.org/bokuweb/react-resizable-decorator)
[![Version](https://img.shields.io/npm/v/react-resizable-decorator.svg?style=flat-square)](https://www.npmjs.com/package/react-resizable-decorator)
[![Code Climate](https://img.shields.io/codeclimate/github/bokuweb/react-resizable-decorator/badges/gpa.svg?style=flat-square)](https://codeclimate.com/github/bokuweb/react-resizable-decorator)
[![License](https://img.shields.io/npm/l/react-resizable-decorator.svg?style=flat-square)](https://github.com/bokuweb/react-resizable-decorator#license)

![screenshot](https://github.com/bokuweb/react-resizable-decorator/blob/master/docs/screenshot.gif?raw=true)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Props](#props)
- [Method](#method)
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

## Props

#### `width: ?(number | string);`

The `width` property is used to set the initial width of a resizable component.   
For example, you can set `300`, `'300px'`, `50%`.     
If ommited, set `'auto'`.    

#### `height: ?(number | string);`

The `height` property is used to set the initial height of a resizable component.    
For example, you can set `300`, `'300px'`, `50%`.    
If ommited, set `'auto'`.    

#### `minWidth: ?number;`

The `minWidth` property is used to set the minimum width of a resizable component.


#### `minHeight: ?number;`

The `minHeight` property is used to set the minimum height of a resizable component.

#### `maxWidth: ?number;`

The `maxWidth` property is used to set the maximum width of a resizable component.

#### `maxHeight: ?number`;

The `maxheight` property is used to set the maximum height of a resizable component.

#### `grid: ?Array<number>;`

The `grid` property is used to specify the increments that resizing should snap to. Defaults to `[1, 1]`.

#### `lockAspectRatio: ?boolean;`

The `lockAspectRatio` property is used to lock aspect ratio.
If ommited, set `false`.

#### `bounds: ?('window' | 'parent');`

Specifies resize boundaries.

#### `handlerStyles: ?HandlersStyles;`

The `handleStyles` property is used to override the style of one or more resize handlers.
Only the axis you specify will have its handler style replaced.
If you specify a value for `right` it will completely replace the styles for the `right` resize handler,
but other handler will still use the default styles.

#### `handlerClasses: ?HandlersClassName;`

The `handlerClasses` property is used to set the className of one or more resize handlers.

#### `isResizable: ?IsResizable;`

The `isResizable` property is used to set the resizable permission of a resizable component.

The permission of `top`, `right`, `bottom`, `left`, `topRight`, `bottomRight`, `bottomLeft`, `topLeft` direction resizing.
If omitted, all resizer are enabled.
If you want to permit only right direction resizing, set `{ top:false, right:true, bottom:false, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }`. 

#### `onResizeStart: ?(event: SyntheticMouseEvent | SyntheticTouchEvent, direction: Direction, resizableRef: React$Component<*>) => void;`

Calls when resizable component resize start.

#### `onResize: ?(event: SyntheticMouseEvent | SyntheticTouchEvent, direction: Direction, resizableRef: React$Component<*>) => void;`

Calls when resizable component resizing.

#### `onResizeStop: ?(event: SyntheticMouseEvent | SyntheticTouchEvent, direction: Direction, resizableRef: React$Component<*>) => void;`

Calls when resizable component resize startStop.

## method

#### `[resize]: (width: string | number, height: string | number) => void;`

Update component size.
`grid` ,`max/minWidth`, `max/minHeight` props is ignored, when this method called.

- for example

``` js
import { resize } from 'react-resizable-decorator';

class YourComponent extends Component {

  update() {
    this.resizable[resize]({ width: 200, height: 300 });
  }
  
  render() {
    return (
      <Resizable ref={c => { this.resizable = c; }}>
        Hello
      </Resizable>
    );
  }
}
```

## Development

``` sh
npm start
```

Open `localhost:3333`.

## Test

``` sh
$ npm run test:ci
```

## Contribute

PR welcome.

## Changelog

#### v0.1.1

- First release.

## License

The MIT License (MIT)

Copyright (c) 2017 Bokuweb

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
