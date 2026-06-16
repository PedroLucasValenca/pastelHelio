import { TestBed } from '@angular/core/testing';
import { MarketScheduleService } from './market-schedule.service';

describe('MarketScheduleService', () => {
  let service: MarketScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketScheduleService);
  });

  it('should feature Wednesday market during its schedule', () => {
    const featured = service.getFeaturedMarket(new Date('2026-06-10T11:00:00.000Z'));

    expect(featured.label).toBe('Estamos hoje');
    expect(featured.location.id).toBe('bigorrilho');
  });

  it('should feature the next market after the current day schedule ends', () => {
    const featured = service.getFeaturedMarket(new Date('2026-06-10T17:00:00.000Z'));

    expect(featured.label).toBe('Próxima feira');
    expect(featured.location.id).toBe('batel');
  });
});
