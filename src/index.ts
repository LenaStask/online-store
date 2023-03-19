import { Controller } from './components/controller/Controller';
import { Store } from './components/model/Store';
import { View } from './components/view/View';
import { items } from './components/data';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'nouislider/dist/nouislider.css';
import './global.css';
import { Item } from './components/type/Item';
import { Criteria } from './components/type/Criteria';

items.sort((a: Item, b: Item) => a.name.localeCompare(b.name));

let store: Store;
let view: View;

const stateStr: string | null = localStorage.getItem('state');
if (stateStr) {
  const state: {criteria: Criteria[], sortBy: string, cart: number[]} = JSON.parse(stateStr);

  store = new Store(state.cart);
  view = new View(state.criteria, state.sortBy);
} else {
  store = new Store();
  view = new View();
}

const controller: Controller = new Controller(store, view);
controller.start();