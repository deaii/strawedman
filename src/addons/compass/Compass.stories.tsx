import React from 'react';
import { CompassFC } from './CompassFC';

import '../../css';
import Compass from './Compass';
import { action } from '@storybook/addon-actions';
import Direction from './Direction';

export default {
  title: 'Compass',
  component: CompassFC
};

function P(dirs: Direction[]): Partial<{[key in Direction]: string}> {
  const rVal: Partial<{[key in Direction]: string}> = {};

  dirs.forEach(dir => { rVal[dir] = `Passage ${dir}`; })

  return rVal;
}

export const DisabledCompass = () => (
  <CompassFC 
    type="default" 
    onClick={action('none')}
    enabledDirections={{}}
  />
);

export const CardinalDirections = () => (
  <CompassFC
    type="default"
    onClick={(passage) => action('Cardinal')(passage)}
    enabledDirections={P(['north', 'south', 'east', 'west'])}
  />
);

export const CardinalVertical = () => (
  <CompassFC
    type="default"
    vertical
    onClick={(passage) => action('Cardinal')(passage)}
    enabledDirections={P(['north', 'south', 'east', 'west'])}
  />
);

