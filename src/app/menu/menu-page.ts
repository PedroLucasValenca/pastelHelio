import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideFlame, LucideMinus, LucidePlus, LucideShoppingBag, LucideTrash2, LucideX } from '@lucide/angular';
import { environment } from '../../environments/environment';
import { MenuCartService } from './menu-cart.service';

interface MenuItem {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly imageAlt: string;
}

type CustomerFormField = 'name' | 'phone' | 'address' | 'paymentMethod' | 'changeFor';

@Component({
  selector: 'ph-menu-page',
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    LucideFlame,
    LucideMinus,
    LucidePlus,
    LucideShoppingBag,
    LucideTrash2,
    LucideX,
  ],
  templateUrl: './menu-page.html',
  styleUrl: './menu-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPageComponent {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly menuCart = inject(MenuCartService);
  private readonly whatsappPhone = environment.deliveryWhatsappPhone;

  protected readonly menuItems = signal<readonly MenuItem[]>([
    {
      name: 'Carne',
      description: 'Carne moída selecionada.',
      price: 14,
      imageAlt: 'Pastel de carne tradicional',
    },
    {
      name: 'Queijo',
      description: 'Mussarela premium derretida.',
      price: 12,
      imageAlt: 'Pastel de queijo derretido',
    },
    {
      name: 'Frango',
      description: 'Frango desfiado temperado.',
      price: 15,
      imageAlt: 'Pastel de frango.',
    },
    {
      name: 'Pizza',
      description: 'Mussarela derretida, fatias de presunto.',
      price: 13,
      imageAlt: 'Pastel sabor pizza',
    },
  ]);

  protected readonly orderItems = this.menuCart.items;
  protected readonly isCustomerModalOpen = signal(false);
  protected readonly customerForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.minLength(8)]],
    address: ['', [Validators.required, Validators.minLength(6)]],
    paymentMethod: ['', [Validators.required]],
    needsChange: [false],
    changeFor: [''],
  });

  protected readonly subtotal = this.menuCart.subtotal;
  protected readonly totalItems = this.menuCart.totalItems;
  protected readonly hasOrderItems = this.menuCart.hasItems;

  protected addItem(menuItem: MenuItem): void {
    this.menuCart.addItem(menuItem);
  }

  protected removeOneItem(itemName: string): void {
    this.menuCart.removeOneItem(itemName);
  }

  protected removeItem(itemName: string): void {
    this.menuCart.removeItem(itemName);
  }

  protected openCustomerModal(): void {
    if (!this.hasOrderItems()) {
      return;
    }

    this.isCustomerModalOpen.set(true);
  }

  protected closeCustomerModal(): void {
    this.isCustomerModalOpen.set(false);
  }

  protected submitOrder(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    window.open(this.getWhatsappUrl(), '_blank', 'noopener');
    this.closeCustomerModal();
  }

  protected isFieldInvalid(fieldName: CustomerFormField): boolean {
    const control = this.customerForm.controls[fieldName];

    return control.invalid && (control.touched || control.dirty);
  }

  protected formatPhoneInput(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    const formattedPhone = this.formatPhone(event.target.value);
    event.target.value = formattedPhone;
    this.customerForm.controls.phone.setValue(formattedPhone);
  }

  protected shouldShowChangeFor(): boolean {
    return this.customerForm.controls.paymentMethod.value === 'dinheiro' && this.customerForm.controls.needsChange.value;
  }

  protected formatPrice(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  private getWhatsappUrl(): string {
    return `https://wa.me/${this.whatsappPhone}?text=${encodeURIComponent(this.getWhatsappMessage())}`;
  }

  private formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    const areaCode = digits.slice(0, 2);
    const firstPart = digits.slice(2, 7);
    const secondPart = digits.slice(7, 11);

    if (digits.length <= 2) {
      return areaCode ? `(${areaCode}` : '';
    }

    if (digits.length <= 7) {
      return `(${areaCode})${firstPart}`;
    }

    return `(${areaCode})${firstPart}-${secondPart}`;
  }

  private getWhatsappMessage(): string {
    const customer = this.customerForm.getRawValue();
    const items = this.orderItems().map((item) => `- ${item.name}: ${item.quantity}`);
    const payment = this.getPaymentMessage(customer.paymentMethod, customer.needsChange, customer.changeFor);

    return [
      'Pedido - Pastel do Helio',
      '',
      'Dados do cliente',
      '----------------',
      `Nome: ${customer.name}`,
      `Telefone: ${customer.phone}`,
      `Endereço de entrega: ${customer.address}`,
      `Pagamento: ${payment}`,
      '',
      'Sabores',
      '-------',
      ...items,
      '',
      `Total: ${this.formatPrice(this.subtotal())}`,
    ].join('\n');
  }

  private getPaymentMessage(paymentMethod: string, needsChange: boolean, changeFor: string): string {
    const paymentLabels: Record<string, string> = {
      dinheiro: 'Dinheiro',
      cartao: 'Cartão',
      pix: 'Pix',
    };
    const paymentLabel = paymentLabels[paymentMethod] ?? paymentMethod;

    if (paymentMethod !== 'dinheiro') {
      return paymentLabel;
    }

    if (!needsChange) {
      return `${paymentLabel} - sem troco`;
    }

    return `${paymentLabel} - troco para ${changeFor || 'não informado'}`;
  }
}
