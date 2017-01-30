/* eslint-disable react/prefer-stateless-function */

import React, { Component } from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import resizable from '../src/index';

describe('resizable decorator', () => {
  it('should render decorated component by resizable without crash', () => {
    @resizable
    class Wrapped extends Component {
      render() {
        return <div>Hello</div>;
      }
    }
    mount(
      <Wrapped />,
      { attachTo: document.querySelector('.main') },
    );
  });
});
