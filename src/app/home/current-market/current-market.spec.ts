import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CurrentMarketComponent } from './current-market';

describe('CurrentMarketComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentMarketComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render featured market information', () => {
    const fixture = TestBed.createComponent(CurrentMarketComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h2')?.textContent).toBeTruthy();
    expect(compiled.textContent).toContain('Curitiba');
    expect(compiled.textContent).toContain('Ver agenda completa');
  });
});
