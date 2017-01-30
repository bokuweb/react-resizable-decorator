/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/no-multi-comp */
/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import assert from 'assert';
import resizable from '../src/index';

export const mouseMove = (node, x, y) => {
  const event = document.createEvent('MouseEvents');
  event.initMouseEvent('mousemove', true, true, window,
    0, 0, 0, x, y, false, false, false, false, 0, null);
  document.dispatchEvent(event);
  return event;
};

describe('resizable decorator', () => {
  describe('smoke mount', () => {
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

  describe('position', () => {
    it('should set position `relative` when wrapped component position equals static', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return <div>Hello</div>;
        }
      }
      const wrapper = mount(
        <Wrapped />,
        { attachTo: document.querySelector('.main') },
      );
      assert.equal(getComputedStyle(wrapper.instance().__resizable).position, 'relative');
    });

    it('should not set position `relative` when wrapped component position equals absolute', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return <div style={{ position: 'absolute' }}>Hello</div>;
        }
      }
      const wrapper = mount(
        <Wrapped />,
        { attachTo: document.querySelector('.main') },
      );
      assert.equal(getComputedStyle(wrapper.instance().__resizable).position, 'absolute');
    });
  });
});
