import Item from './Item';

export default class Items {
  items: { [id: string]: Item } = {};

  public get(itemId: string) {
    return this.items[itemId];
  }

  public add(...items: Item[]) {
    items.forEach((item) => {
      this.items[item.id] = item;
    });
  }
}
