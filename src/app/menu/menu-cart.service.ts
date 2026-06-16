import { computed, Injectable, signal } from '@angular/core';

export interface MenuCartSelection {
  readonly name: string;
  readonly description: string;
  readonly price: number;
}

export interface MenuCartItem extends MenuCartSelection {
  readonly quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class MenuCartService {
  private readonly cartItems = signal<readonly MenuCartItem[]>([]);

  readonly items = this.cartItems.asReadonly();
  readonly subtotal = computed(() => this.items().reduce((total, item) => total + item.price * item.quantity, 0));
  readonly totalItems = computed(() => this.items().reduce((total, item) => total + item.quantity, 0));
  readonly hasItems = computed(() => this.items().length > 0);

  addItem(selection: MenuCartSelection): void {
    this.cartItems.update((items) => {
      const currentItem = items.find((item) => item.name === selection.name);

      if (!currentItem) {
        return [
          ...items,
          {
            name: selection.name,
            description: selection.description,
            quantity: 1,
            price: selection.price,
          },
        ];
      }

      return items.map((item) => (item.name === selection.name ? { ...item, quantity: item.quantity + 1 } : item));
    });
  }

  removeOneItem(itemName: string): void {
    this.cartItems.update((items) =>
      items.flatMap((item) => {
        if (item.name !== itemName) {
          return [item];
        }

        if (item.quantity === 1) {
          return [];
        }

        return [{ ...item, quantity: item.quantity - 1 }];
      }),
    );
  }

  removeItem(itemName: string): void {
    this.cartItems.update((items) => items.filter((item) => item.name !== itemName));
  }
}
