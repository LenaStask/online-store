import { items } from '../data';
import { Store } from '../model/Store';
import { Criteria } from '../type/Criteria';
import { Item } from '../type/Item';
import { View } from '../view/View';

export class Controller {
  private store: Store;
  private view: View;
  
  constructor(store: Store, view: View) {
    this.store = store;
    this.view = view;

    view.bindBeforeUnload(this.beforeUnload.bind(this));

    view.cards.bindCardClick(this.cardClick.bind(this));

    view.filters.bindFilterChange(this.filterChange.bind(this));
    view.filters.bindSortByChange(this.sortByChange.bind(this));
  }

  start() {
    this.view.cart.setCounter(this.store.countItems());
    this.sortByChange(this.view.filters.getCriteria(), this.view.filters.getSortBy());
  }

  beforeUnload(criteria: Criteria[], sortBy: string): void {
    localStorage.setItem('state', JSON.stringify({
      criteria,
      sortBy,
      cart: this.store.getItems()
    }));
  }

  cardClick(itemId: number): void {
    const inCart = this.store.includes(itemId);

    if (!inCart) {
      this.store.addItem(itemId);
    } else {
      this.store.removeItem(itemId);
    }

    this.view.cart.setCounter(this.store.countItems());
    this.view.cards.cardClickDone(itemId);
  }

  filterChange(criteria: Criteria[]): void {
    const filteredItems = this.#getFilteredItems(criteria);

    this.view.cards.render(filteredItems, this.store.getItems());
  }

  sortByChange(criteria: Criteria[], sortBy: string): void {
    const filteredItems = this.#getFilteredItems(criteria);

    filteredItems.sort((a: Item, b: Item) => {
      switch (sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    this.view.cards.render(filteredItems, this.store.getItems());
  }

  #getFilteredItems(criteria: Criteria[]): Item[] {
    let filteredItems;

    if (criteria.length !== 0) {
      filteredItems = items.filter((item: Item) => {
        for (let i = 0; i < criteria.length; i++) {
          let match: boolean = true;

          switch (criteria[i].name) {
            case 'color':
              match = (<string[]>criteria[i].value).includes(item.color);
              break;
            case 'size':
              match = (<string[]>criteria[i].value).includes(item.size); 
              break;
            case 'season':
              match = (<string[]>criteria[i].value).includes(item.season);
              break;
            case 'newArrival':
              match = item.newArrival;
              break;
            case 'priceRange':
              const range = <number[]>criteria[i].value;
              match = range[0] <= item.price && item.price <= range[1];
              break; 
            case 'stockRange':
              const stockRange = <number[]>criteria[i].value;
              match = stockRange[0] <= item.stock && item.stock <= stockRange[1];
              break;  
            case 'searchQuery':
              match = item.name.toUpperCase().includes((<string>criteria[i].value).toUpperCase());
              break;
          }

          if (!match) {
            return false;
          }
        };
        return true;
      });
    } else {
      filteredItems = items;
    }

    return filteredItems;
  }
}