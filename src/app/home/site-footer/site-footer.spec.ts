import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeFooterComponent } from './site-footer';

describe('HomeFooterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeFooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render footer support links', () => {
    const fixture = TestBed.createComponent(HomeFooterComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.footer-brand')?.textContent).toContain('Pastel do Hélio');
    expect(compiled.textContent).toContain('Fale conosco');
  });
});
