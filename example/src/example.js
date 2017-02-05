import React, { Component } from 'react';
import resizable from '../../src';

@resizable
class Hello extends Component {
  render() {
    return (
      <div style={{ background: 'black' }}>Hello</div>
    );
  }
}

export default class Example extends Component {
  render() {
    return (
      <Hello width="100" height="100">Hello</Hello>
    );
  }
}
