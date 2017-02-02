/* @flow */

/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */

import React, { cloneElement } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ResizeHandler from './resize-handler';

import type { Direction } from './resize-handler';

const clamp = (n: number, min: number, max: number): number => Math.max(Math.min(n, max), min);

const snap = (n: number, size: number): number => Math.round(n / size) * size;

const clampAndSnap = (newSize: number, minSize: number, maxSize: number, grid: number): number => {
  const min = (typeof minSize === 'undefined' || minSize < 0) ? 0 : minSize;
  const max = (typeof maxSize === 'undefined' || maxSize < 0) ? newSize : maxSize;
  return snap(clamp(newSize, min, max), grid);
};

const directions: Array<Direction> = [
  'top', 'right', 'bottom', 'left', 'topRight', 'bottomRight', 'bottomLeft', 'topLeft',
];

const userSelectNone = {
  userSelect: 'none',
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  MsUserSelect: 'none',
};

const userSelectAuto = {
  userSelect: 'auto',
  MozUserSelect: 'auto',
  WebkitUserSelect: 'auto',
  MsUserSelect: 'auto',
};

interface IsResizable {
  [direction: Direction]: ?boolean;
}

interface HandlersStyles {
  [direction: Direction]: ?any;
}

interface HandlersClassName {
  [direction: Direction]: ?string;
}

interface Props {
  grid: Array<number>;
  bounds: ?'parent' | 'window';
  minWidth: ?number;
  minHeight: ?number;
  maxWidth: ?number;
  maxHeight: ?number;
  lockAspectRatio: ?boolean;
  isResizable: ?IsResizable;
  handlerStyles: ?HandlersStyles;
  handlerClasses: ?HandlersClassName;
  children: ?any;
}

interface Size {
  width: number;
  height: number;
}

interface Original extends Size {
  x: number;
  y: number;
}

interface State {
  __isResizing: boolean;
  __width: string;
  __height: string;
  __original: Original;
  __direction: Direction;
}


export default function resizable(WrappedComponent: ReactClass<*>): ReactClass<{}> {
  return class Enhancer extends WrappedComponent {

    props: Props;
    state: State;

    __onResizeStart: (e: SyntheticMouseEvent | SyntheticTouchEvent, dir: Direction) => void;
    __onResize: (e: SyntheticMouseEvent | SyntheticTouchEvent) => void;
    __onResizeStop: (e: SyntheticMouseEvent | SyntheticTouchEvent) => void;

    static defaultProps = {
      grid: [1, 1],
      isResizable: {
        top: true, right: true, bottom: true, left: true,
        topRight: true, bottomRight: true, bottomLeft: true, topLeft: true,
      },
      handlerStyles: {},
      handlerClasses: {},
    }

    constructor(props: Props) {
      super(props);
      this.state = {
        __isResizing: false,
        __width: 'auto',
        __height: 'auto',
        __direction: 'right',
        __original: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        },
      };
      this.__resizable = null;
      this.__onResizeStart = this.__onResizeStart.bind(this);
      this.__onResize = this.__onResize.bind(this);
      this.__onResizeStop = this.__onResizeStop.bind(this);

      if (typeof window !== 'undefined') {
        window.addEventListener('mousemove', this.__onResize);
        window.addEventListener('touchmove', this.__onResize);
        window.addEventListener('mouseup', this.__onResizeStop);
        window.addEventListener('touchend', this.__onResizeStop);
      }
    }

    shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
      return shallowCompare(this, nextProps, nextState);
    }

    componentDidMount() {
      if (super.componentDidMount) super.componentDidMount();
      this.__initialize();
    }

    componentWillUnmount() {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mouseup', this.__onResizeStop);
        window.removeEventListener('touchend', this.__onResizeStop);
        window.removeEventListener('mousemove', this.__onResize);
        window.removeEventListener('touchmove', this.__onResize);
      }
    }

    __initialize() {
      if (typeof window !== 'undefined') {
        const style = window.getComputedStyle(this.__resizable, null);
        const position = style.getPropertyValue('position');
        if (position === 'static') this.__resizable.style.position = 'relative';
        this.setState({
          __width: style.getPropertyValue('width'),
          __height: style.getPropertyValue('height'),
        });
      }
    }

    __onResizeStart(event: SyntheticMouseEvent | SyntheticTouchEvent, direction: Direction) {
      let clientX;
      let clientY;
      if (event.nativeEvent instanceof MouseEvent) {
        clientX = event.nativeEvent.clientX;
        clientY = event.nativeEvent.clientY;
      } else if (event.nativeEvent instanceof TouchEvent) {
        clientX = event.nativeEvent.touches[0].clientX;
        clientY = event.nativeEvent.touches[0].clientY;
      }
      this.setState({
        __original: {
          x: clientX,
          y: clientY,
          width: this.__size.width,
          height: this.__size.height,
        },
        __isResizing: true,
        __direction: direction,
      });
    }

    __onResize(event: SyntheticMouseEvent) {
      if (!this.state.__isResizing) return;
      const { clientX, clientY } = event;
      const { __direction, __original, __width, __height } = this.state;
      const { minWidth, minHeight, lockAspectRatio } = this.props;
      const ratio = __original.height / __original.width;
      let { maxWidth, maxHeight } = this.props;
      let newWidth = __original.width;
      let newHeight = __original.height;
      if (/right/i.test(__direction)) newWidth = __original.width + clientX - __original.x;
      if (/left/i.test(__direction)) newWidth = __original.width - clientX + __original.x;
      if (/top/i.test(__direction)) newHeight = __original.height - clientY + __original.y;
      if (/bottom/i.test(__direction)) newHeight = __original.height + clientY - __original.y;

      if (this.props.bounds === 'parent') {
        const parent = this.__resizable.parentNode;
        const boundWidth = parent.offsetWidth + parent.offsetLeft - this.__resizable.offsetLeft;
        const boundHeight = parent.offsetHeight + parent.offsetTop - this.__resizable.offsetTop;
        maxWidth = maxWidth && maxWidth < boundWidth ? maxWidth : boundWidth;
        maxHeight = maxHeight && maxHeight < boundHeight ? maxHeight : boundHeight;
      } else if (this.props.bounds === 'window') {
        const boundWidth = window.innerWidth - this.__resizable.offsetLeft;
        const boundHeight = window.innerHeight - this.__resizable.offsetTop;
        maxWidth = maxWidth && maxWidth < boundWidth ? maxWidth : boundWidth;
        maxHeight = maxHeight && maxHeight < boundHeight ? maxHeight : boundHeight;
      }

      if (lockAspectRatio) {
        const deltaWidth = Math.abs(newWidth - __original.width);
        const deltaHeight = Math.abs(newHeight - __original.height);
        if (deltaWidth < deltaHeight) {
          newWidth = newHeight / ratio;
        } else {
          newHeight = newWidth * ratio;
        }
      }

      newWidth = clampAndSnap(newWidth, minWidth || 0, maxWidth || Infinity, this.props.grid[0]);
      newHeight = clampAndSnap(newHeight, minHeight || 0, maxHeight || Infinity, this.props.grid[1]);

      this.setState({
        __width: __width !== 'auto' ? newWidth : 'auto',
        __height: __height !== 'auto' ? newHeight : 'auto',
      });
    }

    __onResizeStop(event: SyntheticMouseEvent) {
      // TODO: add callbacks
      console.log(event)
      this.setState({
        __isResizing: false,
      });
    }

    get __size(): Size {
      let width = 0;
      let height = 0;
      if (typeof window !== 'undefined') {
        const style = window.getComputedStyle(this.__resizable, null);
        width = ~~style.getPropertyValue('width').replace('px', '');
        height = ~~style.getPropertyValue('height').replace('px', '');
      }
      return { width, height };
    }

    __renderResizers() {
      const { isResizable, handlerStyles, handlerClasses } = this.props;
      return directions.map((dir: Direction) => {
        if (isResizable && isResizable[dir]) {
          return (
            <ResizeHandler
              key={dir}
              direction={dir}
              onResizeStart={this.__onResizeStart}
              style={handlerStyles && handlerStyles[dir]}
              className={handlerClasses && handlerClasses[dir]}
              />
          );
        }
        return null;
      }).filter((r) => !!r);
    }

    render() {
      const element = super.render();
      const userSelect = this.state.__isResizing ? userSelectNone : userSelectAuto;
      const props = {
        ...element.props,
        style: {
          ...(element.props.style || {}),
          width: this.state.__width,
          height: this.state.__height,
          userSelect,
        },
        ref: (c: React$Component<*>) => { this.__resizable = c; },
      };
      return cloneElement(
        element,
        props,
        [this.props.children, this.__renderResizers()]
      );
    }
  };
}
