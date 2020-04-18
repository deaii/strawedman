import Direction from './Direction';

const DirectionAliases: {[alias: string]: Direction} = {
  dn: 'down',

  n: 'north',
  ne: 'northeast',
  e: 'east',
  se: 'southeast',
  s: 'south',
  sw: 'southwest',
  w: 'west',
  nw: 'northwest',

  f: 'forward',
  fore: 'forward',
  back: 'backward',
  aftright: 'backright',
  aftward: 'backward',
  aftleft: 'backleft',

  sbb: 'starboardbow',
  sb: 'starboard',
  sbs: 'starboardstern',
  st: 'stern',
  ps: 'portstern',
  pb: 'portbow',
  pt: 'port',
  p: 'port',

  r: 'rimward',
  rim: 'rimward',
  rt: 'rimwardbyturnwise',
  t: 'turnwise',
  ht: 'hubwardbyturnwise',
  h: 'hubward',
  hub: 'hubward',
  hw: 'hubwardbywiddershins',
  ws: 'widdershins',
  rw: 'rimwardbywiddershins',
};

export default DirectionAliases;
