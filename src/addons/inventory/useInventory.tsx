import Items from './Items';
import Inventory from './Inventory';
import EngineComponent from '../../core/EngineComponent';

declare global {
  interface Window {
    items: Items;
    inventory: Inventory;
  }
}

export default function useItems(): EngineComponent {
  window.items = new Items();
  window.inventory = new Inventory();
  return {
    FC: window.inventory.getComponent(),
    name: 'inventory',
  };
}
