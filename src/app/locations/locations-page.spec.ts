import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LocationsPageComponent } from './locations-page';
import { LocationsScheduleService } from './services/locations-schedule.service';

describe('LocationsPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationsPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: LocationsScheduleService,
          useValue: {
            locations: () => [
              {
                id: 'agua-verde',
                day: 'Terça-feira',
                dayIndex: 2,
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
              {
                id: 'juveve',
                day: 'Terça-feira',
                dayIndex: 2,
                title: 'Feira do Juvevê',
                address: 'Avenida Anita Garibaldi com Rua Campos Salles',
                neighborhood: 'Juvevê',
                city: 'Curitiba',
                state: 'Paraná',
                startTime: '17:00',
                endTime: '20:30',
                isAddressConfirmed: true,
                coordinates: [-25.409, -49.259],
              },
              {
                id: 'bigorrilho',
                day: 'Quarta-feira',
                dayIndex: 3,
                title: 'Feira do Bigorrilho',
                address: 'Rua Martin Pena',
                neighborhood: 'Bigorrilho',
                city: 'Curitiba',
                state: 'Paraná',
                startTime: '07:30',
                endTime: '11:30',
                isAddressConfirmed: true,
                coordinates: [-25.43, -49.295],
              },
              {
                id: 'batel',
                day: 'Quinta-feira',
                dayIndex: 4,
                title: 'Feira do Batel',
                address: 'Alameda Dom Pedro II',
                neighborhood: 'Batel',
                city: 'Curitiba',
                state: 'Paraná',
                startTime: '07:30',
                endTime: '11:30',
                isAddressConfirmed: true,
                coordinates: [-25.442, -49.286],
              },
              {
                id: 'hauer',
                day: 'Sábado',
                dayIndex: 6,
                title: 'Feira do Hauer',
                address: 'Praça da Passarela',
                neighborhood: 'Hauer',
                city: 'Curitiba',
                state: 'Paraná',
                startTime: '08:00',
                endTime: '13:00',
                isAddressConfirmed: true,
                coordinates: [-25.495, -49.249],
              },
              {
                id: 'domingo',
                day: 'Domingo',
                dayIndex: 0,
                title: 'Feira de Domingo',
                address: 'Praça 29 de Março',
                neighborhood: 'Curitiba',
                city: 'Curitiba',
                state: 'Paraná',
                startTime: '08:00',
                endTime: '13:00',
                isAddressConfirmed: true,
                coordinates: [-25.43, -49.282],
              },
            ],
            getDeliveryTimeLabel: () => '17:00 - 21:00',
            getFeaturedMarket: () => ({
              label: 'Próxima feira',
              location: {
                id: 'agua-verde',
                day: 'Terça-feira',
                dayIndex: 2,
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
            getTimeRange: (location: { startTime: string; endTime: string }) => `${location.startTime} - ${location.endTime}`,
            isDeliveryVisible: () => true,
          },
        },
      ],
    }).compileComponents();
  });

  it('should render Curitiba weekly locations', () => {
    const fixture = TestBed.createComponent(LocationsPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Agenda das Feiras');
    expect(compiled.textContent).toContain('Curitiba');
    expect(compiled.textContent).toContain('Rua Dom Pedro I');
    expect(compiled.textContent).toContain('Avenida Anita Garibaldi');
    expect(compiled.textContent).toContain('Praça 29 de Março');
    expect(compiled.querySelector('.maps-link')?.textContent).toContain('Abrir no Google Maps');
    expect(compiled.querySelector('.leaflet-map')).toBeTruthy();
  });

  it('should open Google Maps using location coordinates', () => {
    const fixture = TestBed.createComponent(LocationsPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const mapsLink = compiled.querySelector<HTMLAnchorElement>('.maps-link');

    expect(mapsLink?.href).toContain('query=-25.449%2C-49.287');
  });

  it('should render delivery card when delivery is visible', () => {
    const fixture = TestBed.createComponent(LocationsPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.delivery-card')?.textContent).toContain('Prefere delivery?');
    expect(compiled.querySelector('.delivery-card a')?.getAttribute('href')).toBe('/cardapio');
  });

  it('should select a location from the schedule cards', () => {
    const fixture = TestBed.createComponent(LocationsPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll<HTMLElement>('.schedule-card');

    cards[4].click();
    fixture.detectChanges();

    expect(cards[4].classList.contains('is-active')).toBe(true);
    expect(cards[0].textContent).toContain('Próxima feira');
  });
});
