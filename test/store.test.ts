import { Store } from "../src/components/model/Store";

test('Create store with items', () => {
  const store: Store = new Store([1, 2, 3]);

  expect(store.countItems()).toBe(3);
  expect(store.includes(1)).toBeTruthy();
});

test('Add a new item to store', () => {
  const store: Store = new Store();

  store.addItem(1);

  expect(store.countItems()).toBe(1);
  expect(store.includes(1)).toBeTruthy();
});

test('Add more than one item to store', () => {
  const store: Store = new Store();

  store.addItem(1);
  store.addItem(2);
  store.addItem(3);

  expect(store.countItems()).toBe(3);
});
 
test('Remove an existing item from store', () => {
  const store: Store = new Store([1, 2, 3]);

  store.removeItem(2);

  expect(store.countItems()).toBe(2);
  expect(store.includes(2)).toBeFalsy();
});

test('Count items in store', () => {
  const store: Store = new Store([1, 2, 3]);

  expect(store.countItems()).toBe(3);
 
});

test('Get items from store', () => {
  const store: Store = new Store([1, 2, 3]);

  expect(store.getItems()).toStrictEqual([1, 2, 3]);
 
});