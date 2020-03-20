import { Story } from "../../core/Story";
import { Item } from "./Item";

export class Inventory {
  private readonly stateName: string;

  items: {[id: string]: Item} = {};

  public constructor(compact = false, stateName: string = "__inv"){
    this.stateName = stateName;
  }

  public setup(story: Story) {
  }
}