import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideClock } from '@lucide/angular';
import { LocationsScheduleService } from '../../locations/services/locations-schedule.service';

@Component({
  selector: 'ph-current-market',
  imports: [RouterLink, LucideClock],
  templateUrl: './current-market.html',
  styleUrl: './current-market.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentMarketComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly locationsSchedule = inject(LocationsScheduleService);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly featuredMarket = signal(this.locationsSchedule.getFeaturedMarket());

  protected readonly timeRange = computed(() => this.locationsSchedule.getTimeRange(this.featuredMarket().location));

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const intervalId = window.setInterval(() => {
      this.featuredMarket.set(this.locationsSchedule.getFeaturedMarket());
    }, 60_000);

    this.destroyRef.onDestroy(() => window.clearInterval(intervalId));
  }
}
