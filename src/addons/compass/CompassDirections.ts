import Direction from './Direction';

interface CompassDir {
  title: string;
  label: string;
  className: string;
}

const toDir = (title: string, label: string, className: string) => ({ title, label, className });

const CompassDirections: { [dir in Direction]: CompassDir } = {
  up: toDir('Go Up', 'Up', 'up'),
  down: toDir('Go Down', 'Dn', 'dn'),
  in: toDir('Go In', 'In', 'in'),
  out: toDir('Go Out', 'Out', 'out'),

  north: toDir('Go North', 'N', 'n'),
  northeast: toDir('Go Northeast', 'NE', 'ne'),
  east: toDir('Go East', 'E', 'e'),
  southeast: toDir('Go Southeast', 'SE', 'se'),
  south: toDir('Go South', 'S', 's'),
  southwest: toDir('Go Southwest', 'SW', 'sw'),
  west: toDir('Go West', 'W', 'w'),
  northwest: toDir('Go Northwest', 'SE', 'nw'),

  forward: toDir('Go Forward', 'F', 'n'),
  foreright: toDir('Go Fore Right', 'FR', 'ne'),
  right: toDir('Go Right', 'R', 'e'),
  backright: toDir('Go Back Right', 'BR', 'se'),
  backward: toDir('Go Backwards', 'B', 's'),
  backleft: toDir('Go Back Left', 'BL', 'sw'),
  left: toDir('Go Left', 'L', 'w'),
  foreleft: toDir('Go Fore Left', 'FL', 'nw'),

  bow: toDir('Go Bowward', 'B', 'n'),
  starboardbow: toDir('Go Starboard Bow', 'SBB', 'ne'),
  starboard: toDir('Go Starboard', 'SB', 'e'),
  starboardstern: toDir('Go Starboard Stern', 'SBS', 'se'),
  stern: toDir('Go Stern', 'St', 's'),
  portstern: toDir('Go Port Stern', 'PS', 'sw'),
  port: toDir('Go Port', 'P', 'w'),
  portbow: toDir('Go Port Bow', 'PB', 'nw'),

  rimward: toDir('Go Rimward', 'Rw', 'n'),
  rimwardbyturnwise: toDir('Go Rimward by Turnwise', 'RT', 'ne'),
  turnwise: toDir('Go Turnwise', 'Tw', 'e'),
  hubwardbyturnwise: toDir('Go Hubward by Turnwise', 'HT', 'se'),
  hubward: toDir('Go Hubward', 'H', 's'),
  hubwardbywiddershins: toDir('Go Hubward by Widdershins', 'HW', 'sw'),
  widdershins: toDir('Go Widdershins', 'Ws', 'w'),
  rimwardbywiddershins: toDir('Go Rimward by Widdershins', 'RW', 'nw'),
};

export default CompassDirections;
