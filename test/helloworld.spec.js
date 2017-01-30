import React from 'react';
import { screenshot } from 'karma-nightmare';
import { mount } from 'enzyme';
import assert from 'assert';
import HelloWorld from '../src/index';

describe('Hello', () => {
  it('Should render hello', (done) => {
    mount(
      <HelloWorld />,
      { attachTo: document.querySelector('.main') },
    );
    screenshot('./docs/snapshot/hello.png').then(done);
  });
});
