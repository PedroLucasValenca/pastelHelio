import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EventsPageComponent } from './events-page';

describe('EventsPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render events and order rules', () => {
    const fixture = TestBed.createComponent(EventsPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Pastel do Hélio');
    expect(compiled.textContent).toContain('Pedido mínimo de 20 pastéis');
    expect(compiled.textContent).toContain('Festas juninas e julinas');
    expect(compiled.textContent).toContain('Casamentos e aniversários');
  });

  it('should provide whatsapp and email contact actions', () => {
    const fixture = TestBed.createComponent(EventsPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('a[href^="https://wa.me/"]')).toBeTruthy();
    expect(compiled.querySelector('a[href^="mailto:"]')).toBeTruthy();
  });
});
