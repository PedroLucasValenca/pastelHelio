import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { LucideBike, LucideClock, LucideUtensils } from '@lucide/angular';
import type * as Leaflet from 'leaflet';
import { LocationsScheduleService } from './services/locations-schedule.service';
import { MarketLocation } from './services/market-schedule.service';

@Component({
  selector: 'ph-locations-page',
  imports: [RouterLink, LucideBike, LucideClock, LucideUtensils],
  templateUrl: './locations-page.html',
  styleUrl: './locations-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly locationsSchedule = inject(LocationsScheduleService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly mapContainer = viewChild<ElementRef<HTMLElement>>('mapContainer');
  private readonly hasManualSelection = signal(false);
  private leaflet?: typeof import('leaflet');
  private map?: Leaflet.Map;
  private markerLayer?: Leaflet.LayerGroup;
  private mapInitAttempts = 0;

  protected readonly city = 'Curitiba';
  protected readonly state = 'Paraná';
  protected readonly deliveryTimeLabel = signal(this.locationsSchedule.getDeliveryTimeLabel());
  protected readonly isDeliveryVisible = signal(this.locationsSchedule.isDeliveryVisible());
  protected readonly isMapReady = signal(false);
  protected readonly hasMapError = signal(false);
  protected readonly locations = this.locationsSchedule.locations;
  protected readonly featuredMarket = signal(this.locationsSchedule.getFeaturedMarket());
  protected readonly selectedLocation = signal(this.featuredMarket().location);
  protected readonly mapEmbedUrl = computed(() => this.getSafeMapsEmbedUrl(this.selectedLocation()));

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    afterNextRender(() => {
      this.queueMapInit();
    });

    const intervalId = window.setInterval(() => {
      const featuredMarket = this.locationsSchedule.getFeaturedMarket();

      this.deliveryTimeLabel.set(this.locationsSchedule.getDeliveryTimeLabel());
      this.isDeliveryVisible.set(this.locationsSchedule.isDeliveryVisible());
      this.featuredMarket.set(featuredMarket);

      if (!this.hasManualSelection()) {
        this.setSelectedLocation(featuredMarket.location, false);
      } else {
        this.refreshMarkers();
      }
    }, 60_000);

    this.destroyRef.onDestroy(() => window.clearInterval(intervalId));
  }

  protected getTimeRange(location: MarketLocation): string {
    return this.locationsSchedule.getTimeRange(location);
  }

  protected getGoogleMapsUrl(location: MarketLocation): string {
    return `https://www.google.com/maps/search/?api=1&query=${this.getMapCoordinatesQuery(location)}`;
  }

  protected selectLocation(location: MarketLocation): void {
    this.hasManualSelection.set(true);
    this.setSelectedLocation(location);
  }

  private setSelectedLocation(location: MarketLocation, shouldMoveMap = true): void {
    this.selectedLocation.set(location);
    this.refreshMarkers();

    if (shouldMoveMap) {
      this.map?.setView(this.getLatLng(location), 15, { animate: true });
    }
  }

  private queueMapInit(delay = 0): void {
    window.setTimeout(() => {
      void this.initMap();
    }, delay);
  }

  private async initMap(): Promise<void> {
    const container = this.mapContainer();

    if (this.map || this.isMobileViewport()) {
      return;
    }

    if (!container || container.nativeElement.offsetWidth === 0 || container.nativeElement.offsetHeight === 0) {
      if (this.mapInitAttempts < 10) {
        this.mapInitAttempts += 1;
        this.queueMapInit(100);
      }

      return;
    }

    try {
      const leaflet = await import('leaflet');

      this.leaflet = leaflet;
      this.map = leaflet
        .map(container.nativeElement, {
          attributionControl: true,
          zoomControl: true,
        })
        .setView(this.getLatLng(this.selectedLocation()), 14);

      leaflet
        .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })
        .addTo(this.map);

      this.markerLayer = leaflet.layerGroup().addTo(this.map);
      this.refreshMarkers();
      this.isMapReady.set(true);
      window.setTimeout(() => this.map?.invalidateSize(), 0);
    } catch {
      this.hasMapError.set(true);
    }
  }

  private refreshMarkers(): void {
    if (!this.leaflet || !this.markerLayer) {
      return;
    }

    this.markerLayer.clearLayers();

    for (const location of this.locations()) {
      const isSelected = location.id === this.selectedLocation().id;
      const isFeatured = location.id === this.featuredMarket().location.id;
      const marker = this.leaflet.marker(this.getLatLng(location), {
        icon: this.getMarkerIcon(location, isSelected, isFeatured),
        title: location.title,
      });

      marker.on('click', () => this.selectLocation(location));
      marker.addTo(this.markerLayer);
    }
  }

  private getMarkerIcon(location: MarketLocation, isSelected: boolean, isFeatured: boolean): Leaflet.DivIcon {
    const className = `ph-map-marker${isSelected ? ' is-selected' : ''}${isFeatured ? ' is-featured' : ''}`;
    const badge = isFeatured ? '<span class="ph-map-marker-badge">Próxima feira</span>' : '';

    return this.leaflet!.divIcon({
      className,
      html: `<span class="ph-map-marker-label"><strong>${this.escapeMapLabel(location.title)}</strong><small>${this.escapeMapLabel(location.day)}</small>${badge}</span><span class="ph-map-marker-dot"></span>`,
      iconAnchor: [90, isSelected ? 104 : 92],
      iconSize: [180, isSelected ? 104 : 92],
    });
  }

  private escapeMapLabel(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  private getLatLng(location: MarketLocation): Leaflet.LatLngTuple {
    return [location.coordinates[0], location.coordinates[1]];
  }

  private isMobileViewport(): boolean {
    if (typeof window.matchMedia === 'function') {
      return window.matchMedia('(max-width: 640px)').matches;
    }

    return window.innerWidth <= 640;
  }

  private getSafeMapsEmbedUrl(location: MarketLocation): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps?q=${this.getMapCoordinatesQuery(location)}&output=embed`,
    );
  }

  private getMapCoordinatesQuery(location: MarketLocation): string {
    return encodeURIComponent(`${location.coordinates[0]},${location.coordinates[1]}`);
  }
}
