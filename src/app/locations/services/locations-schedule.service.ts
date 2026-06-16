import { inject, Injectable } from '@angular/core';
import { DeliveryScheduleService } from './delivery-schedule.service';
import { MarketLocation, MarketScheduleService } from './market-schedule.service';

@Injectable({
  providedIn: 'root',
})
export class LocationsScheduleService {
  private readonly deliverySchedule = inject(DeliveryScheduleService);
  private readonly marketSchedule = inject(MarketScheduleService);

  readonly locations = this.marketSchedule.locations;

  getDeliveryTimeLabel(now = new Date()): string {
    return this.deliverySchedule.getDeliveryTimeLabel(now);
  }

  getFeaturedMarket(now = new Date()) {
    return this.marketSchedule.getFeaturedMarket(now);
  }

  getTimeRange(location: MarketLocation): string {
    return this.marketSchedule.formatTimeRange(location);
  }

  isDeliveryVisible(now = new Date()): boolean {
    return this.deliverySchedule.isDeliveryVisible(now);
  }
}
