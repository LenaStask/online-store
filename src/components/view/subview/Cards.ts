import { Item } from '../../type/Item';

export class Cards {
  private el: HTMLElement;

  constructor() {
    this.el = document.querySelector('#cards')!;
  }

  bindCardClick(handler: (itemId: number) => void): void {
    this.el.addEventListener('click', (e: Event) => {
      const target = <HTMLElement>e.target!;
      if (target.classList.contains('card__btn')) {
        e.preventDefault();
        const cardEl: HTMLElement = target.closest('.card')!;
        handler(+cardEl.dataset.id!);
      }
    });
  }

  cardClickDone(itemId: number): void {
    const cardEl: HTMLElement = this.el.querySelector(`.card[data-id="${itemId}"]`)!;
    const cardBtn: HTMLElement = cardEl.querySelector('.card__btn')!;

    const inCart: boolean = cardEl.dataset.inCart === 'true';

    this.#renderCardBtn(cardBtn, !inCart);
    cardEl.dataset.inCart = String(!inCart);
  }

  render(items: Item[], cartItemIds: number[]): void {
    this.el.innerHTML = '';

    const cardTemp: HTMLTemplateElement = document.querySelector('#cardTemplate')!;

    items.forEach((item: Item) => {
      const inCart: boolean = cartItemIds.includes(item.id); 
      
      const cardFragment: DocumentFragment = <DocumentFragment>cardTemp.content.cloneNode(true);
      const cardEl: HTMLElement = <HTMLElement>cardFragment.querySelector('.card')!;
      
      cardEl.dataset.id = item.id.toString();
      cardEl.dataset.inCart = String(inCart);

      const cardImageEl: HTMLImageElement = <HTMLImageElement>cardEl.querySelector('.item__image')!;
      cardImageEl.src = item.image;
      cardImageEl.alt = item.name;

      cardEl.querySelector('.item__name')!.textContent = item.name;
      cardEl.querySelector('.item__size > span')!.textContent = item.size;
      cardEl.querySelector('.item__color > span')!.textContent = item.color;
      cardEl.querySelector('.item__season > span')!.textContent = item.season;
      cardEl.querySelector('.item__stock > span')!.textContent = item.stock.toString();
      cardEl.querySelector('.item__price > span')!.textContent = item.price.toString();

      const cardBtn: HTMLElement = cardEl.querySelector('.card__btn')!;
      this.#renderCardBtn(cardBtn, inCart);

      this.el.append(cardEl);
    });
  }

  #renderCardBtn(cardBtn: HTMLElement, inCart: boolean): void {
    if (!inCart) {
      cardBtn.classList.replace('btn-danger', 'btn-primary');
      cardBtn.innerText = 'Add to cart';  
    } else {
      cardBtn.classList.replace('btn-primary', 'btn-danger');
      cardBtn.innerText = 'Remove from cart';
    }
  }
}