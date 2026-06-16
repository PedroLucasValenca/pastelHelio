import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideMenu, LucideShoppingCart } from '@lucide/angular';
import { MenuCartService } from '../../menu/menu-cart.service';

@Component({
  selector: 'ph-home-header',
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive, LucideMenu, LucideShoppingCart],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHeaderComponent {
  private readonly menuCart = inject(MenuCartService);

  protected readonly isMobileMenuOpen = signal(false);
  protected readonly cartItemsCount = this.menuCart.totalItems;
  protected readonly hasCartItems = this.menuCart.hasItems;

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((isOpen) => !isOpen);
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
