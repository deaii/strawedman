
export default interface Item {
  id: string;
  name: string;
  image: string;
  description: string;

  /**
   * If true, then more than one of this item exists.  When an item is added to
   * the player's inventory that already exists in the player's inventory, one
   * of two things happens:
   * - If countable is 'true', then the quantity of the item is incremented.
   * - If countable is 'false', then an error is thrown.
   */
  countable?: boolean;

  /**
   * If 'true', then the item is automatically removed from the player's inventory
   * on use.  Defaults to 'true' if the item is countable, 'false' otherwise.  Even
   * if 'false', an item can be removed from a player's inventory via a custom
   * script.
   */
  depletable?: boolean;

  /**
   * If set, this item is enabled when the 'from' passage is shown, and clicking the
   * item will move the story to the 'to' passage.
   */
  passages?: {from: string, to: string}[];
}
