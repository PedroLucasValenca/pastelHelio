import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeHeroComponent } from './hero-section';

describe('HomeHeroComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeHeroComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render the main call to action', () => {
    const fixture = TestBed.createComponent(HomeHeroComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Tradição em Cada Mordida.');
    expect(compiled.querySelector('.button-primary')?.textContent).toContain('Peça agora');
  });
});
