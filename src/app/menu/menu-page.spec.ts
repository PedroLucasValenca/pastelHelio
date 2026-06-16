import { TestBed } from '@angular/core/testing';
import { MenuCartService } from './menu-cart.service';
import { MenuPageComponent } from './menu-page';

describe('MenuPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPageComponent],
    }).compileComponents();
  });

  it('should render menu items and an empty order summary', () => {
    const fixture = TestBed.createComponent(MenuPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const orderText = compiled.querySelector('.order-card')?.textContent?.replace(/\s/g, ' ');

    expect(compiled.querySelector('h2')?.textContent).toContain('A sele');
    expect(compiled.querySelectorAll('.menu-card')).toHaveLength(4);
    expect(orderText).toContain('Escolha seus sabores');
    expect(orderText).toContain('R$ 0,00');
  });

  it('should add and remove items from the cart', () => {
    const fixture = TestBed.createComponent(MenuPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const addButtons = compiled.querySelectorAll<HTMLButtonElement>('.menu-card-footer button');

    addButtons[0].click();
    addButtons[0].click();
    fixture.detectChanges();

    expect(compiled.querySelector('.order-card')?.textContent?.replace(/\s/g, ' ')).toContain('2 - Carne');
    expect(compiled.querySelector('.order-card')?.textContent?.replace(/\s/g, ' ')).toContain('R$ 28,00');

    compiled.querySelector<HTMLButtonElement>('.quantity-controls button')?.click();
    fixture.detectChanges();

    expect(compiled.querySelector('.order-card')?.textContent?.replace(/\s/g, ' ')).toContain('1 - Carne');
    expect(compiled.querySelector('.order-card')?.textContent?.replace(/\s/g, ' ')).toContain('R$ 14,00');
  });

  it('should keep selected cart items when the menu component is recreated', () => {
    const firstFixture = TestBed.createComponent(MenuPageComponent);
    firstFixture.detectChanges();

    const firstCompiled = firstFixture.nativeElement as HTMLElement;
    firstCompiled.querySelector<HTMLButtonElement>('.menu-card-footer button')?.click();
    firstFixture.detectChanges();
    firstFixture.destroy();

    const secondFixture = TestBed.createComponent(MenuPageComponent);
    secondFixture.detectChanges();

    const compiled = secondFixture.nativeElement as HTMLElement;

    expect(TestBed.inject(MenuCartService).totalItems()).toBe(1);
    expect(compiled.querySelector('.order-card')?.textContent?.replace(/\s/g, ' ')).toContain('1 - Carne');
  });

  it('should send customer data and flavor quantities through whatsapp', () => {
    const fixture = TestBed.createComponent(MenuPageComponent);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const addButtons = compiled.querySelectorAll<HTMLButtonElement>('.menu-card-footer button');

    addButtons[0].click();
    addButtons[1].click();
    addButtons[1].click();
    fixture.detectChanges();

    compiled.querySelector<HTMLButtonElement>('.whatsapp-button')?.click();
    fixture.detectChanges();

    const nameInput = compiled.querySelector<HTMLInputElement>('#customer-name')!;
    const phoneInput = compiled.querySelector<HTMLInputElement>('#customer-phone')!;
    const addressInput = compiled.querySelector<HTMLTextAreaElement>('#customer-address')!;
    const moneyInput = compiled.querySelector<HTMLInputElement>('input[value="dinheiro"]')!;

    nameInput.value = 'Pedro';
    nameInput.dispatchEvent(new Event('input'));
    moneyInput.click();
    fixture.detectChanges();

    const changeCheckbox = compiled.querySelector<HTMLInputElement>('.change-checkbox input')!;
    changeCheckbox.click();
    fixture.detectChanges();

    const changeForInput = compiled.querySelector<HTMLInputElement>('#customer-change-for')!;
    changeForInput.value = '50';
    changeForInput.dispatchEvent(new Event('input'));
    phoneInput.value = '41999990000';
    phoneInput.dispatchEvent(new Event('input'));
    addressInput.value = 'Rua das Flores, 123';
    addressInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    compiled.querySelector<HTMLButtonElement>('.modal-submit')?.click();
    fixture.detectChanges();

    const [url] = openSpy.mock.calls[0];
    const message = decodeURIComponent(String(url).split('text=')[1]);

    expect(message).toContain('Pedido - Pastel do Helio');
    expect(message).toContain('Dados do cliente');
    expect(message).toContain('Nome: Pedro');
    expect(message).toContain('Telefone: (41)99999-0000');
    expect(message).toContain('Endereço de entrega: Rua das Flores, 123');
    expect(message).toContain('Pagamento: Dinheiro - troco para 50');
    expect(message).toContain('- Carne: 1');
    expect(message).toContain('- Queijo: 2');
  });
});
