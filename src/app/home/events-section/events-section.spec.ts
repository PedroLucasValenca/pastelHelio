import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeEventsComponent } from './events-section';
import { LocationsScheduleService } from '../../locations/services/locations-schedule.service';

describe('HomeEventsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeEventsComponent],
      providers: [
        provideRouter([]),
        {
          provide: LocationsScheduleService,
          useValue: {
            getDeliveryTimeLabel: () => '17:00 - 21:00',
            getFeaturedMarket: () => ({
              label: 'Próxima feira',
              location: {
                id: 'agua-verde',
                day: 'Terça-feira',
                title: 'Feira do Água Verde',
                address: 'Rua Dom Pedro I',
                neighborhood: 'Água Verde',
                city: 'Curitiba',
                state: 'Paraná',
                startTime: '07:30',
                endTime: '11:30',
                isAddressConfirmed: true,
                coordinates: [-25.449, -49.287],
              },
            }),
            getTimeRange: () => '07:30 - 11:30',
            isDeliveryVisible: () => true,
          },
        },
      ],
    }).compileComponents();
  });

  it('should render the next market as the featured event', () => {
    const fixture = TestBed.createComponent(HomeEventsComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h2')?.textContent).toContain('Próximos eventos');
    expect(compiled.querySelector('.featured-event')?.textContent).toContain('Feira do Água Verde');
    expect(compiled.querySelector('.featured-event')?.textContent).toContain('07:30 - 11:30');
  });

  it('should render delivery card when delivery is visible', () => {
    const fixture = TestBed.createComponent(HomeEventsComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.delivery-card')?.textContent).toContain('Delivery aberto');
    expect(compiled.querySelector('.delivery-card a')?.getAttribute('href')).toBe('/cardapio');
  });
});
