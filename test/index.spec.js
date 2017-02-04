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

  describe('resizers', () => {
    it('should render all resize handler when default props', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return <div>Hello</div>;
        }
      }
      const wrapper = shallow(
        <Wrapped />,
        { attachTo: document.querySelector('.main') },
      );
      assert.equal(wrapper.find('ResizeHandler').length, 8);
    });

    it('should not render top resize handler when enable only top resizer', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div>Hello</div>
          );
        }
      }
      const wrapper = shallow(
        <Wrapped isResizable={{ top: true }} />,
        { attachTo: document.querySelector('.main') },
      );
      const handlers = wrapper.find('ResizeHandler');
      assert.equal(handlers.length, 1);
      assert.equal(handlers.node.props.direction, 'top');
    });

    it('should append className to resize handler when handlerClassName props set', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div>Hello</div>
          );
        }
      }
      const wrapper = shallow(
        <Wrapped isResizable={{ top: true }} handlerClasses={{ top: 'topClassName' }} />,
        { attachTo: document.querySelector('.main') },
      );
      const handlers = wrapper.find('ResizeHandler');
      assert.equal(handlers.node.props.className, 'topClassName');
    });

    it('should append customStyle to resize handler when handlerStyle props set', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div>Hello</div>
          );
        }
      }
      const wrapper = shallow(
        <Wrapped
          isResizable={{ top: true }}
          handlerStyles={{ top: { width: '5px', color: 'red' } }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handlers = wrapper.find('ResizeHandler');
      assert.deepEqual(handlers.node.props.style, { width: '5px', color: 'red' });
    });
  });
});
