import { Criteria } from '../type/Criteria';
import { Cards } from './subview/Cards';
import { Cart } from './subview/Cart';
import { Filters } from './subview/Filters';

export class View {
  public cart: Cart;
  public filters: Filters;
  public cards: Cards;

  constructor(criteria?: Criteria[], sortBy: string = "name_asc") {
    this.cart = new Cart();
    this.filters = new Filters(criteria || [], sortBy);
    this.cards = new Cards();
  }

  bindBeforeUnload(handler: (criteria: Criteria[], sortBy: string) => void): void {
    window.addEventListener('beforeunload', () => {
      handler(this.filters.getCriteria(), this.filters.getSortBy());
    });
  }
}