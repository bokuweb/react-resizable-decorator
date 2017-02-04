/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/no-multi-comp */
/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import assert from 'assert';
import { spy } from 'sinon';
import resizable from '../src/index';

const mouseDown = (node, x, y) => {
  const event = document.createEvent('MouseEvents');
  event.initMouseEvent('mousedown', true, true, window,
    0, 0, 0, x, y, false, false, false, false, 0, null);
  node.dispatchEvent(event);
  return event;
};

const mouseMove = (x, y) => {
  const event = document.createEvent('MouseEvents');
  event.initMouseEvent('mousemove', true, true, window,
    0, 0, 0, x, y, false, false, false, false, 0, null);
  document.dispatchEvent(event);
  return event;
};

const mouseUp = (x, y) => {
  const event = document.createEvent('MouseEvents');
  event.initMouseEvent('mouseup', true, true, window,
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

  describe('callback', () => {
    it('should call onResizeStart when resize handler dragged', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div id="resizable">Hello</div>
          );
        }
      }
      const onResizeStart = spy();
      const wrapper = mount(
        <Wrapped
          onResizeStart={onResizeStart}
          isResizable={{ bottomRight: true }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handler = wrapper.find('ResizeHandler');
      assert(handler);
      handler.simulate('mousedown');
      assert.equal(onResizeStart.callCount, 1);
      assert.deepEqual(onResizeStart.args[0][1], 'bottomRight');
      assert.deepEqual(onResizeStart.args[0][2].id, 'resizable');
    });

    it('should call onResize when resize handler dragged and moved', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div id="resizable">Hello</div>
          );
        }
      }
      const onResize = spy();
      const wrapper = mount(
        <Wrapped
          onResize={onResize}
          isResizable={{ bottomRight: true }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handler = wrapper.find('ResizeHandler');
      assert(handler);
      handler.simulate('mousedown');
      mouseMove(0, 0);
      assert.equal(onResize.callCount, 1);
      assert.deepEqual(onResize.args[0][0].type, 'mousemove');
      assert.deepEqual(onResize.args[0][1], 'bottomRight');
      assert.deepEqual(onResize.args[0][2].id, 'resizable');
    });

    it('should call onResizeStop when resize handler dragged and stopped', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div id="resizable">Hello</div>
          );
        }
      }
      const onResizeStop = spy();
      const wrapper = mount(
        <Wrapped
          onResizeStop={onResizeStop}
          isResizable={{ bottomRight: true }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handler = wrapper.find('ResizeHandler');
      assert(handler);
      mouseDown(handler.getDOMNode(), 100, 100);
      mouseMove(0, 0);
      mouseUp(0, 0);
      assert.equal(onResizeStop.callCount, 1);
      assert.deepEqual(onResizeStop.args[0][0].type, 'mouseup');
      assert.deepEqual(onResizeStop.args[0][1], 'bottomRight');
      assert.deepEqual(onResizeStop.args[0][2].id, 'resizable');
    });
  });

  describe('integration', () => {
    it('should resize 100 * 100 to 200 * 200', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div id="resizable" style={{ background: 'black' }}>
              Hello
            </div>
          );
        }
      }
      const onResizeStop = spy();
      const wrapper = mount(
        <Wrapped
          width="100px"
          height="100px"
          onResizeStop={onResizeStop}
          isResizable={{ bottomRight: true }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handler = wrapper.find('ResizeHandler');
      mouseDown(handler.getDOMNode(), 100, 100);
      mouseMove(200, 200);
      mouseUp(200, 200);
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).width, '200px');
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).height, '200px');
    });

    it('should resize 200 * 200 to 100 * 100', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div id="resizable" style={{ background: 'black' }}>
              Hello
            </div>
          );
        }
      }
      const onResizeStop = spy();
      const wrapper = mount(
        <Wrapped
          width="200px"
          height="200px"
          onResizeStop={onResizeStop}
          isResizable={{ bottomRight: true }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handler = wrapper.find('ResizeHandler');
      mouseDown(handler.getDOMNode(), 200, 200);
      mouseMove(100, 100);
      mouseUp(100, 100);
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).width, '100px');
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).height, '100px');
    });

    it('should minWidth set when trying to make it smaller than the minWidth', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div id="resizable" style={{ background: 'black' }}>
              Hello
            </div>
          );
        }
      }
      const onResizeStop = spy();
      const wrapper = mount(
        <Wrapped
          width="200"
          height="200"
          minWidth="80"
          onResizeStop={onResizeStop}
          isResizable={{ bottomRight: true }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handler = wrapper.find('ResizeHandler');
      mouseDown(handler.getDOMNode(), 200, 200);
      mouseMove(40, 100);
      mouseUp(40, 100);
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).width, '80px');
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).height, '100px');
    });

    it('should minHeight set when trying to make it smaller than the minHeight', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div id="resizable" style={{ background: 'black' }}>
              Hello
            </div>
          );
        }
      }
      const onResizeStop = spy();
      const wrapper = mount(
        <Wrapped
          width="200"
          height="200"
          minHeight="80"
          onResizeStop={onResizeStop}
          isResizable={{ bottomRight: true }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handler = wrapper.find('ResizeHandler');
      mouseDown(handler.getDOMNode(), 200, 200);
      mouseMove(100, 40);
      mouseUp(100, 40);
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).width, '100px');
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).height, '80px');
    });

    it('should maxWidth set when trying to make it larger than the maxWidth', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div id="resizable" style={{ background: 'black' }}>
              Hello
            </div>
          );
        }
      }
      const onResizeStop = spy();
      const wrapper = mount(
        <Wrapped
          width="200"
          height="200"
          maxWidth="300"
          onResizeStop={onResizeStop}
          isResizable={{ bottomRight: true }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handler = wrapper.find('ResizeHandler');
      mouseDown(handler.getDOMNode(), 200, 200);
      mouseMove(400, 400);
      mouseUp(400, 400);
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).width, '300px');
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).height, '400px');
    });

    it('should maxHeight set when trying to make it larger than the maxWidth', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div id="resizable" style={{ background: 'black' }}>
              Hello
            </div>
          );
        }
      }
      const onResizeStop = spy();
      const wrapper = mount(
        <Wrapped
          width="200"
          height="200"
          maxHeight="300"
          onResizeStop={onResizeStop}
          isResizable={{ bottomRight: true }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handler = wrapper.find('ResizeHandler');
      mouseDown(handler.getDOMNode(), 200, 200);
      mouseMove(400, 400);
      mouseUp(400, 400);
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).width, '400px');
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).height, '300px');
    });

    it('should snapped ro grid when set x axis grid and not reached grid value', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div id="resizable" style={{ background: 'black' }}>
              Hello
            </div>
          );
        }
      }
      const onResizeStop = spy();
      const wrapper = mount(
        <Wrapped
          width="200"
          height="200"
          grid={[20, 1]}
          onResizeStop={onResizeStop}
          isResizable={{ bottomRight: true }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handler = wrapper.find('ResizeHandler');
      mouseDown(handler.getDOMNode(), 200, 200);
      mouseMove(190, 400);
      mouseUp(190, 400);
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).width, '200px');
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).height, '400px');
      mouseDown(handler.getDOMNode(), 190, 400);
      mouseMove(205, 400);
      mouseUp(205, 400);
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).width, '220px');
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).height, '400px');
    });

    it('should snapped ro grid when set y axis grid and not reached grid value', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div id="resizable" style={{ background: 'black' }}>
              Hello
            </div>
          );
        }
      }
      const onResizeStop = spy();
      const wrapper = mount(
        <Wrapped
          width="200"
          height="200"
          grid={[1, 20]}
          onResizeStop={onResizeStop}
          isResizable={{ bottomRight: true }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handler = wrapper.find('ResizeHandler');
      mouseDown(handler.getDOMNode(), 200, 200);
      mouseMove(400, 190);
      mouseUp(400, 190);
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).width, '400px');
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).height, '200px');
      mouseDown(handler.getDOMNode(), 400, 190);
      mouseMove(400, 205);
      mouseUp(400, 205);
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).width, '400px');
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).height, '220px');
    });

    it('should keep aspect ratio when set lockAspectRatio props and resize x axis', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div id="resizable" style={{ background: 'black' }}>
              Hello
            </div>
          );
        }
      }
      const onResizeStop = spy();
      const wrapper = mount(
        <Wrapped
          width="200"
          height="200"
          lockAspectRatio
          onResizeStop={onResizeStop}
          isResizable={{ bottomRight: true }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handler = wrapper.find('ResizeHandler');
      mouseDown(handler.getDOMNode(), 200, 200);
      mouseMove(400, 200);
      mouseUp(400, 200);
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).width, '400px');
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).height, '400px');
    });

    it('should keep aspect ratio when set lockAspectRatio props and resize y axis', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div id="resizable" style={{ background: 'black' }}>
              Hello
            </div>
          );
        }
      }
      const onResizeStop = spy();
      const wrapper = mount(
        <Wrapped
          width="200"
          height="200"
          lockAspectRatio
          onResizeStop={onResizeStop}
          isResizable={{ bottomRight: true }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handler = wrapper.find('ResizeHandler');
      mouseDown(handler.getDOMNode(), 200, 200);
      mouseMove(200, 300);
      mouseUp(200, 300);
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).width, '300px');
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).height, '300px');
    });

    it('should snapped to  parent size when set bounds equals parent and resize', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div id="resizable" style={{ background: 'black' }}>
              Hello
            </div>
          );
        }
      }
      const onResizeStop = spy();
      const wrapper = mount(
        <Wrapped
          width="200"
          height="200"
          bounds="parent"
          onResizeStop={onResizeStop}
          isResizable={{ bottomRight: true }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handler = wrapper.find('ResizeHandler');
      mouseDown(handler.getDOMNode(), 200, 200);
      mouseMove(400, 400);
      mouseUp(400, 400);
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).width, '300px');
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).height, '300px');
    });

    it('should resize window size when bounds not equals parent', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div id="resizable" style={{ background: 'black' }}>
              Hello
            </div>
          );
        }
      }
      const onResizeStop = spy();
      const wrapper = mount(
        <Wrapped
          width="200"
          height="200"
          onResizeStop={onResizeStop}
          isResizable={{ bottomRight: true }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handler = wrapper.find('ResizeHandler');
      mouseDown(handler.getDOMNode(), 200, 200);
      mouseMove(800, 600);
      mouseUp(800, 600);
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).width, '800px');
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).height, '600px');
    });

    it('should be able to resize larger than window sizem when bounds is not set', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div id="resizable" style={{ background: 'black' }}>
              Hello
            </div>
          );
        }
      }
      const onResizeStop = spy();
      const wrapper = mount(
        <Wrapped
          width="200"
          height="200"
          onResizeStop={onResizeStop}
          isResizable={{ bottomRight: true }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handler = wrapper.find('ResizeHandler');
      mouseDown(handler.getDOMNode(), 200, 200);
      mouseMove(1000, 800);
      mouseUp(1000, 800);
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).width, '1000px');
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).height, '800px');
    });

    it('should snapped to window size when set bounds equals window and resize', () => {
      @resizable
      class Wrapped extends Component {
        render() {
          return (
            <div id="resizable" style={{ background: 'black' }}>
              Hello
            </div>
          );
        }
      }
      const onResizeStop = spy();
      const wrapper = mount(
        <Wrapped
          width="200"
          height="200"
          bounds="window"
          onResizeStop={onResizeStop}
          isResizable={{ bottomRight: true }}
        />,
        { attachTo: document.querySelector('.main') },
      );
      const handler = wrapper.find('ResizeHandler');
      mouseDown(handler.getDOMNode(), 200, 200);
      mouseMove(1000, 800);
      mouseUp(1000, 800);
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).width, '800px');
      assert.equal(getComputedStyle(onResizeStop.args[0][2]).height, '578px');
    });    
  });
});
