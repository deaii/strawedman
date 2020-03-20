import _ from 'lodash';

/**
 * An object representing a passage. The current passage will be `window.passage`
 *
 * @class Passage
 */

export interface Passage {
  /**
   * The numerical ID of the passage.  Should be unique.  Script and Config passages
   * are read in id order.
   */
  id: number;

  /**
   * The name of the passage.  Again, should be unique.
   */
  name: string;

  /**
   * The tags associated with the passage.
   */
  tags: string[];
  
  /**
   * The contents of the passage.
   */
  source: string;
}

export default Passage;
