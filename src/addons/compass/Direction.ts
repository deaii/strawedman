
type Direction =
  // Cardinal Directions
  'north'
  | 'northeast'
  | 'east'
  | 'southeast'
  | 'south'
  | 'southwest'
  | 'west'
  | 'northwest'

  // Universal Directions
  | 'up'
  | 'down'
  | 'in'
  | 'out'

  // Relative Directions
  | 'forward'
  | 'foreright'
  | 'right'
  | 'backright'
  | 'backward'
  | 'backleft'
  | 'left'
  | 'foreleft'

  // Naval-Vessel Directions
  | 'bow'
  | 'starboardbow'
  | 'starboard'
  | 'starboardstern'
  | 'stern'
  | 'portstern'
  | 'port'
  | 'portbow'

  // Diskworld Directions
  | 'rimward'
  | 'rimwardbyturnwise'
  | 'turnwise'
  | 'hubwardbyturnwise'
  | 'hubward'
  | 'hubwardbywiddershins'
  | 'widdershins'
  | 'rimwardbywiddershins';

export default Direction;
