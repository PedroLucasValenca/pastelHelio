import { TestBed } from '@angular/core/testing';
import { LocationsScheduleService } from './locations-schedule.service';

describe('LocationsScheduleService', () => {
  let service: LocationsScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationsScheduleService);
  });

  it('should expose market and delivery schedules', () => {
    const featured = service.getFeaturedMarket(new Date('2026-06-10T11:00:00.000Z'));

    expect(service.locations().length).toBeGreaterThan(0);
    expect(featured.location.id).toBe('bigorrilho');
    expect(service.getTimeRange(featured.location)).toBe('07:30 - 11:30');
    expect(service.isDeliveryVisible(new Date('2026-06-08T19:40:00.000Z'))).toBe(true);
  });
});
