import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideBike, LucideUtensilsCrossed } from '@lucide/angular';
import { LocationsScheduleService } from '../../locations/services/locations-schedule.service';

@Component({
  selector: 'ph-home-events',
  imports: [NgOptimizedImage, RouterLink, LucideBike, LucideUtensilsCrossed],
  templateUrl: './events-section.html',
  styleUrl: './events-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeEventsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly locationsSchedule = inject(LocationsScheduleService);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly featuredMarket = signal(this.locationsSchedule.getFeaturedMarket());
  protected readonly deliveryTimeLabel = signal(this.locationsSchedule.getDeliveryTimeLabel());
  protected readonly isDeliveryVisible = signal(this.locationsSchedule.isDeliveryVisible());

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const intervalId = window.setInterval(() => {
      this.featuredMarket.set(this.locationsSchedule.getFeaturedMarket());
      this.deliveryTimeLabel.set(this.locationsSchedule.getDeliveryTimeLabel());
      this.isDeliveryVisible.set(this.locationsSchedule.isDeliveryVisible());
    }, 60_000);

    this.destroyRef.onDestroy(() => window.clearInterval(intervalId));
  }

  protected getTimeRange(): string {
    return this.locationsSchedule.getTimeRange(this.featuredMarket().location);
  }
}
