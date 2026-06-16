import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeFooterComponent } from './home/site-footer/site-footer';
import { HomeHeaderComponent } from './home/site-header/site-header';

@Component({
  selector: 'ph-root',
  imports: [RouterOutlet, HomeFooterComponent, HomeHeaderComponent],
  template: `
    <ph-home-header />

    <main>
      <router-outlet />
    </main>

    <ph-home-footer />
  `,
  styles: `
    :host {
      display: block;
      min-height: 100dvh;
      color: var(--ph-color-text);
      background: var(--ph-color-bg);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
