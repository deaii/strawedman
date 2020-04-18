import Direction from './Direction';
import CompassType from './CompassType';

const UNIVERSAL_DIRECTIONS: Direction[] = ['in', 'out', 'up', 'down'];

const DEFAULT_DIRECTIONS: Direction[] = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest', ...UNIVERSAL_DIRECTIONS];

const RELATIVE_DIRECTIONS: Direction[] = ['forward', 'foreright', 'right', 'backright', 'backward', 'backleft', 'left', 'foreleft', ...UNIVERSAL_DIRECTIONS];

const VESSEL_DIRECTIONS: Direction[] = ['bow', 'starboardbow', 'starboard', 'starboardstern', 'stern', 'portstern', 'port', 'portbow', ...UNIVERSAL_DIRECTIONS];

const DISKWORLD_DIRECTIONS: Direction[] = ['rimward', 'rimwardbyturnwise', 'turnwise', 'hubwardbyturnwise', 'hubward', 'hubwardbywiddershins', 'widdershins', 'rimwardbywiddershins', ...UNIVERSAL_DIRECTIONS];

const CompassTypes: {[type in CompassType]: Direction[]} = {
  default: DEFAULT_DIRECTIONS,
  cardinal: DEFAULT_DIRECTIONS,
  relative: RELATIVE_DIRECTIONS,
  vessel: VESSEL_DIRECTIONS,
  naval: VESSEL_DIRECTIONS,
  diskworld: DISKWORLD_DIRECTIONS,
  disk: DISKWORLD_DIRECTIONS,
};

export default CompassTypes;
