/* @flow */

/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable no-bitwise */
/* eslint-disable no-mixed-operators */
/* eslint-disable react/jsx-filename-extension */

import React, { cloneElement } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import ResizeHandler from './resize-handler';

import type { Direction } from './resize-handler';

export const resize = Symbol('resize');

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
  bounds: ?('parent' | 'window');
  width: ?(number | string);
  height: ?(number | string);
  minWidth: ?number;
  minHeight: ?number;
  maxWidth: ?number;
  maxHeight: ?number;
  lockAspectRatio: ?boolean;
  isResizable: ?IsResizable;
  handlerStyles: ?HandlersStyles;
  handlerClasses: ?HandlersClassName;
  children: ?any;
  onResizeStart: ?(event: SyntheticMouseEvent | SyntheticTouchEvent, direction: Direction, resizableRef: React$Component<*>) => void;
  onResize: ?(event: SyntheticMouseEvent | SyntheticTouchEvent, direction: Direction, resizableRef: React$Component<*>) => void;
  onResizeStop: ?(event: SyntheticMouseEvent | SyntheticTouchEvent, direction: Direction, resizableRef: React$Component<*>) => void;
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
  __width: string | number;
  __height: string | number;
  __original: Original;
  __direction: Direction;
}


export default function resizable(WrappedComponent: ReactClass<*>): ReactClass<{}> {
  class Enhancer extends WrappedComponent {

    props: Props;
    state: State;

    __onResizeStart: (e: SyntheticMouseEvent | SyntheticTouchEvent, dir: Direction) => void;
    __onResize: (e: SyntheticMouseEvent | SyntheticTouchEvent) => void;
    __onResizeStop: (e: SyntheticMouseEvent | SyntheticTouchEvent) => void;

    static defaultProps = {
      width: 'auto',
      height: 'auto',
      grid: [1, 1],
      isResizable: {
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      },
      handlerStyles: {},
      handlerClasses: {},
      onResizeStart: () => { },
      onResize: () => { },
      onResizeStop: () => { },
    }

    constructor(props: Props) {
      super(props);
      this.state = {
        __isResizing: false,
        __width: props.width ? props.width : 'auto',
        __height: props.height ? props.height : 'auto',
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
      if (this.props.onResizeStart) {
        this.props.onResizeStart(event, direction, this.__resizable);
      }
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
      if (this.props.onResize) {
        this.props.onResize(event, __direction, this.__resizable);
      }
    }

    __onResizeStop(event: SyntheticMouseEvent) {
      this.setState({
        __isResizing: false,
      });
      if (this.props.onResizeStop) {
        this.props.onResizeStop(event, this.state.__direction, this.__resizable);
      }
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
      }).filter(r => !!r);
    }

    // flow-disable-line
    [resize](width: string | number, height: string | number) {
      this.setState({
        __width: width,
        __height: height,
      });
    }

    render() {
      const element = super.render();
      const userSelect = this.state.__isResizing ? userSelectNone : userSelectAuto;
      // For new version React.
      const width = typeof this.state.__width === 'string' && this.state.__width !== 'auto' && !/px/.test(this.state.__width) ||
        typeof this.state.__width === 'number'
        ? `${this.state.__width}px`
        : this.state.__width;
      const height = typeof this.state.__height === 'string' && this.state.__height !== 'auto' && !/px/.test(this.state.__height) ||
        typeof this.state.__height === 'number'
        ? `${this.state.__height}px`
        : this.state.__height;
      const props = {
        ...element.props,
        style: {
          ...(element.props.style || {}),
          width,
          height,
          ...userSelect,
        },
        ref: (c: React$Component<*>) => { this.__resizable = c; },
      };
      return cloneElement(
        element,
        props,
        [element.props.children, this.__renderResizers()],
      );
    }
  }

  Object.defineProperty(Enhancer, 'name', { value: WrappedComponent.name, configurable: true });
  return Enhancer;
}
