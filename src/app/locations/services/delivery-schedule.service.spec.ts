import { TestBed } from '@angular/core/testing';
import { DeliveryScheduleService } from './delivery-schedule.service';

describe('DeliveryScheduleService', () => {
  let service: DeliveryScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryScheduleService);
  });

  it('should hide delivery before preview time', () => {
    expect(service.isDeliveryVisible(new Date('2026-06-08T19:39:00.000Z'))).toBe(false);
  });

  it('should show delivery from 16:40 on Monday to Friday', () => {
    expect(service.isDeliveryVisible(new Date('2026-06-08T19:40:00.000Z'))).toBe(true);
  });

  it('should hide delivery after 21:00 from Monday to Thursday', () => {
    expect(service.isDeliveryVisible(new Date('2026-06-11T00:30:00.000Z'))).toBe(false);
  });

  it('should show delivery until 22:00 on Friday', () => {
    expect(service.isDeliveryVisible(new Date('2026-06-12T19:39:00.000Z'))).toBe(false);
    expect(service.isDeliveryVisible(new Date('2026-06-13T00:30:00.000Z'))).toBe(true);
    expect(service.isDeliveryVisible(new Date('2026-06-13T01:00:00.000Z'))).toBe(false);
    expect(service.getDeliveryTimeLabel(new Date('2026-06-13T00:30:00.000Z'))).toBe('17:00 - 22:00');
  });
});
