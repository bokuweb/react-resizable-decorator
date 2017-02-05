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
          flexDirection: 'column',
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
        maxWidth="800"
        maxHeight="600"        
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
        <div>RESIZABLE  DECORATOR</div>
        <div style={{ fontSize: '11px', fontFamily: 'arial' }}>
          min 360 * 160, max 800 * 600
        </div>
      </Resizable>
    );
  }
}
