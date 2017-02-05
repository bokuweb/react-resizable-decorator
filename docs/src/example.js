import React, { Component } from 'react';
import resizable from '../../src';

@resizable
class Resizable extends Component {
  render() {
    return (
      <div
        style={{
          borderTop: 'double 3px #fff',
          borderBottom: 'double 3px #fff',
          color: 'white',
          fontSize: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default class Example extends Component {
  render() {
    return (
      <Resizable
        width="360"
        height="160"
        minWidth="360"
        minHeight="160"
        isResizable={{ bottomRight: true }}
        handlerStyles={{
          bottomRight: {
            borderBottom: 'solid 1px #fff',
            borderRight: 'solid 1px #fff',
            bottom: '10px',
            right: '10px',
          },
        }}
      >
        <p>RESIZABLE  DECORATOR</p>
      </Resizable>
    );
  }
}
