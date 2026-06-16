import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CurrentMarketComponent } from '../current-market/current-market';
import { HomeEventsComponent } from '../events-section/events-section';
import { HomeHeroComponent } from '../hero-section/hero-section';

@Component({
  selector: 'ph-home-page',
  imports: [CurrentMarketComponent, HomeEventsComponent, HomeHeroComponent],
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
