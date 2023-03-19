export class Store {
  private itemIds: number[];

  constructor(itemIds?: number[]) {
    this.itemIds = itemIds || [];
  }

  addItem(itemId: number): void {
    this.itemIds.push(itemId);
  }

  countItems(): number {
    return this.itemIds.length;
  }

  getItems(): number[] {
    return this.itemIds;
  }

  includes(itemId: number): boolean {
    return this.itemIds.includes(itemId);
  }

  removeItem(itemId: number): void {
    this.itemIds = this.itemIds.filter((id: number) => id !== itemId);
  }
}