import React from 'react';
import { isNullOrUndefined } from 'util';

import StoryData from '../../core/StoryData';
import InventoryData from './InventoryData';
import InventorySlot from './InventorySlot';

export default class Inventory {
  private readonly stateName: string;

  // eslint-disable-next-line class-methods-use-this
  private get items() {
    return window.items.items;
  }

  get data(): InventoryData {
    let inventory = window.state[this.stateName] as InventoryData;
    if (isNullOrUndefined(inventory)) {
      inventory = {};
      window.state[this.stateName] = inventory;
    }

    return inventory;
  }

  /**
   * Maps an item to a passage: when the item is 'used', then
   */
  relevantItems: { [id: string]: string } = {};

  public constructor(stateName: string = '__inv') {
    this.stateName = stateName;

    window.events.passageHidden.on(() => {
      this.relevantItems = {};
    });


    window.events.passageShowing.on((data) => {
      const { items } = window.items;
      Object.keys(items).forEach((key) => {
        const item = items[key];
        if (item.passages) {
          const psg = item.passages.find((up) => up.from === data.passageName);
          if (psg) {
            this.relevantItems[key] = psg.to;
          }
        }
      });
    });
  }

  public enableItem(itemId: string, to: string) {
    this.relevantItems[itemId] = to;
  }

  public add(itemId: string, count?: number) {
    const ct = count || 1;

    const item = this.items[itemId];
    const inventory = this.data;
    const invItem = inventory[itemId];

    if (!item) {
      window.events.storyError.trigger(`Item ${itemId} not a valid item.`);
    }

    if (invItem) {
      if (item.countable) {
        invItem.count += ct;
      }
    } else {
      inventory[itemId] = { id: itemId, count: ct };
    }
  }

  public useItem(itemId: string) {
    // Double-check that the item is relevant
    const toPassage = this.relevantItems[itemId];
    const invItem = this.data[itemId];

    if (!invItem) {
      window.events.storyError.trigger(
        `Item ${itemId} not found in player inventory.`,
      );
    }

    if (toPassage) {
      const item = this.items[itemId];

      if (item.countable) {
        if (item.depletable !== false) {
          invItem.count -= 1;

          if (invItem.count <= 0) {
            delete this.data[itemId];
          }
        }
      } else if (item.depletable) {
        delete this.data[itemId];
      }

      window.engine.show(toPassage);
    }
  }

  public get(itemId: string): null | InventorySlot {
    return this.data[itemId] || null;
  }

  public getComponent(): React.FC<StoryData> {
    const self = this;

    return () => {
      const inventory = self.data;

      const items = Object.keys(inventory).map((id) => {
        const item = self.items[id];

        return (
          <button
            type="button"
            className="sm-inventory-item"
            title={item.name}
            onClick={() => self.useItem(id)}
            disabled={self.relevantItems[id] == null}
          >
            <img src={item.image} alt="" />
          </button>
        );
      });

      return (
        <div className="sm-inventory">
          <fieldset>
            <legend>Your Inventory</legend>
            {items}
          </fieldset>
        </div>
      );
    };
  }
}
