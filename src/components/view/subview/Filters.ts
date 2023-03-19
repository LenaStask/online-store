import { Criteria } from '../../type/Criteria';
import * as noUiSlider from 'nouislider';

export class Filters {
  private el: HTMLElement;
  private priceSlider: noUiSlider.target;
  private stockSlider: noUiSlider.target;
  private searchQuery: string;

  constructor(criteria: Criteria[], sortBy: string) {
    this.el = document.querySelector('#filters')!;
    
    this.priceSlider = this.el.querySelector('#priceSlider')!;
    noUiSlider.create(this.priceSlider, {
      connect: true,
      range: {
        'min': 0,
        'max': 3500
      },
      start: [0, 3500],
      step: 50,
    });

    this.stockSlider = this.el.querySelector('#stockSlider')!;
    noUiSlider.create(this.stockSlider, {
      connect: true,
      range: {
        'min': 0,
        'max': 10
      },
      start: [0,10],
      step: 1,
    });

    this.searchQuery = '';

    this.init(criteria, sortBy);
  }

  init(criteria: Criteria[], sortBy: string): void {
    for (let i = 0; i < criteria.length; i++) {
      switch (criteria[i].name) {
        case 'color':
          const colors: string[] = <string[]>criteria[i].value;
          for (let j = 0; j < colors.length; j++) {
            const el: HTMLInputElement = this.el.querySelector(`[name="color[]"][value="${colors[j]}"]`)!;
            el.checked = true;
          }
          break;
        
        case 'size':
          const sizes: string[] = <string[]>criteria[i].value;
          for (let j = 0; j < sizes.length; j++) {
            const el: HTMLInputElement = this.el.querySelector(`[name="size[]"][value="${sizes[j]}"]`)!;
            el.checked = true;
          }
          break;

        case 'season':
          const seasons: string[] = <string[]>criteria[i].value;
          for (let j = 0; j < seasons.length; j++) {
            const el: HTMLInputElement = this.el.querySelector(`[name="season[]"][value="${seasons[j]}"]`)!;
            el.checked = true;
          }
          break;
        case 'newArrival':
          const el: HTMLInputElement = this.el.querySelector(`[name="newArrival"]`)!;
          el.checked  = true;
          break;
        case 'priceRange':
          const range: number[] = <number[]>criteria[i].value;
          this.priceSlider.noUiSlider?.set(range);
          break; 
        case 'stockRange':
          const ranges: number[] = <number[]>criteria[i].value;
          this.stockSlider.noUiSlider?.set(ranges);
          break;  
      }
    }
  };

  bindFilterChange(handler: (criteria: Criteria[]) => void): void {
    this.el.addEventListener('change', (e: Event) => {
      if ((<HTMLInputElement>e.target!).type === 'checkbox') {
        handler(this.getCriteria());
      }
    });

    const searchBtn = this.el.querySelector('#searchBtn')!;
    searchBtn.addEventListener('click', (e: Event) => {
      const searchInput: HTMLInputElement = this.el.querySelector('#searchInput')!;
      this.searchQuery = searchInput.value;
      handler(this.getCriteria());
    });

    const resetBtn = this.el.querySelector('#resetFiltersBtn')!;
    resetBtn.addEventListener('click', (e: Event) => {
      this.reset();
      this.priceSlider.noUiSlider!.reset();
      this.stockSlider.noUiSlider!.reset();
      handler([]);
    });

    this.priceSlider.noUiSlider!.on('update', (values) => {
      const priceSliderValue: HTMLElement = this.el.querySelector('#priceSliderValue')!;
      priceSliderValue.innerHTML = values.join(' - ');
      handler(this.getCriteria());
    });

    this.stockSlider.noUiSlider!.on('update', (values) => {
      const stockSliderValue: HTMLElement = this.el.querySelector('#stockSliderValue')!;
      stockSliderValue.innerHTML = values.join(' - ');
      handler(this.getCriteria());
    });
  }

  bindSortByChange(handler: (criteria: Criteria[], sortBy: string) => void): void {
    const sortByEl: HTMLInputElement = this.el.querySelector('#sortBy')!;
    sortByEl.addEventListener('change', () => {
      handler(this.getCriteria(), this.getSortBy());
    });
  }

  getCriteria(): Criteria[] {
    const criteria: Criteria[] = [];

    let els: HTMLInputElement[] = Array.from(this.el.querySelectorAll('[name="color[]"]:checked'));
    if (els.length) {
      criteria.push({
        name: 'color',
        value: els.map((el: HTMLInputElement) => el.value)
      });
    }

    els = Array.from(this.el.querySelectorAll('[name="size[]"]:checked'));
    if (els.length) {
      criteria.push({
        name: 'size',
        value: els.map((el: HTMLInputElement) => el.value)
      });
    }

    els = Array.from(this.el.querySelectorAll('[name="season[]"]:checked'));
    if (els.length) {
      criteria.push({
        name: 'season',
        value: els.map((el: HTMLInputElement) => el.value)
      });
    }

    const el = this.el.querySelector('[name="newArrival"]:checked');
    if (el) {
      criteria.push({
        name: 'newArrival',
        value: true
      });
    }

    const range: number[] = <number[]>this.priceSlider.noUiSlider!.get(true);
    criteria.push({
      name: 'priceRange',
      value: range
    });

    const stockRange: number[] = <number[]>this.stockSlider.noUiSlider!.get(true);
    criteria.push({
      name: 'stockRange',
      value: stockRange
    });

    if (this.searchQuery != '') {
      criteria.push({
        name: 'searchQuery',
        value: this.searchQuery
      });
    }

    return criteria;
  }

  getSortBy(): string {
    const sortByEl: HTMLInputElement = this.el.querySelector('#sortBy')!;
    return sortByEl.value;
  }

  reset(): void {
    let els: HTMLInputElement[] = Array.from(this.el.querySelectorAll('[type="checkbox"]'));
    for (let i=0; i<els.length; i++) {
      els[i].checked = false;
    }
    (<HTMLInputElement>this.el.querySelector('#searchInput')!).value = '';
    this.searchQuery = '';
  }
}