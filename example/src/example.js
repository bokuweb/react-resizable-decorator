import React, { Component } from 'react';
import resizable from '../../src';

@resizable
class HelloWorld extends Component {

  componentDidMount() {
    console.log('aaaaaaaaaaa');
  }

  render() {
    return (
      <h1
        onClick={() => console.log('click')}
        style={{ color: 'red', fontFamily: 'arial', marginLeft: '100px' }}
      >
        {this.props.children}
      </h1>
    );
  }
}

export default class Example extends Component {
  render() {
    return (
      <HelloWorld bounds={"parent"}>Hello</HelloWorld>
    );
  }
}
