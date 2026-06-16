import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContactPageComponent } from './contact-page';

describe('ContactPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render contact channels', () => {
    const fixture = TestBed.createComponent(ContactPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('WhatsApp');
    expect(compiled.querySelector('a[href="https://www.instagram.com/pasteldohelio/"]')).toBeTruthy();
    expect(compiled.textContent).toContain('@pasteldohelio');
  });

  it('should provide whatsapp and email message actions', () => {
    const fixture = TestBed.createComponent(ContactPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('a[href^="https://wa.me/"]')).toBeTruthy();
    expect(compiled.querySelector('a[href^="mailto:"]')).toBeTruthy();
  });
});
