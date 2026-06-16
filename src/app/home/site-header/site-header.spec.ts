import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MenuCartService } from '../../menu/menu-cart.service';
import { HomeHeaderComponent } from './site-header';

describe('HomeHeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeHeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render the brand navigation', () => {
    const fixture = TestBed.createComponent(HomeHeaderComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.brand-name')?.textContent).toContain('Pastel do Hélio');
    expect(compiled.querySelector('nav')?.textContent).toContain('Cardápio');
    expect(compiled.querySelector('nav')?.textContent).toContain('Locais');
  });

  it('should show the cart indicator when there are selected items', () => {
    const menuCart = TestBed.inject(MenuCartService);
    menuCart.addItem({
      name: 'Carne',
      description: 'Carne moida selecionada.',
      price: 14,
    });

    const fixture = TestBed.createComponent(HomeHeaderComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.cart-badge')?.textContent).toContain('1');
    expect(compiled.querySelector('.cart-link')?.getAttribute('aria-label')).toBe('Ver carrinho com 1 itens');
  });
});
