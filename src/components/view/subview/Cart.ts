export class Cart {
  setCounter(counter: number): void {
    const cartCounter: HTMLElement = document.querySelector('#cartCounter')!;
    cartCounter.textContent = counter.toString();
  }
}