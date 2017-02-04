/* @flow */

/* eslint-disable max-len */
/* eslint-disable react/jsx-filename-extension */

import React, { PropTypes } from 'react';
import styles from './styles';

export type Direction = 'top' | 'right' | 'bottom' | 'left' | 'topRight' | 'bottomRight' | 'bottomLeft' | 'topLeft';

export interface HandlerProps {
  direction: Direction;
  className: ?string;
  style: ?any;
  onResizeStart: (e: SyntheticMouseEvent | SyntheticTouchEvent, dir: Direction) => void;
}

export default function ResizeHandler(props: HandlerProps): React$Element<*> {
  return (
    <div
      className={props.className}
      style={{
        ...styles.base,
        ...styles[props.direction],
        ...(props.style || {}),
      }}
      onMouseDown={(e: SyntheticMouseEvent) => props.onResizeStart(e, props.direction)}
      onTouchStart={(e: SyntheticTouchEvent) => props.onResizeStart(e, props.direction)}
    />
  );
}

ResizeHandler.defaultProps = {
  style: {},
  className: '',
};

ResizeHandler.propTypes = {
  onResizeStart: PropTypes.func.isRequired,
  direction: PropTypes.oneOf([
    'top', 'right', 'bottom', 'left',
    'topRight', 'bottomRight', 'bottomLeft', 'topLeft',
  ]).isRequired,
  style: PropTypes.any, // eslint-disable-line 
  className: PropTypes.string,
};
