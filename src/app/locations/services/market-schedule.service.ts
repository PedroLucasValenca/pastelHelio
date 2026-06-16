import { Injectable, signal } from '@angular/core';

export interface MarketLocation {
  readonly id: string;
  readonly day: string;
  readonly dayIndex: number;
  readonly title: string;
  readonly address: string;
  readonly neighborhood: string;
  readonly city: string;
  readonly state: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly isAddressConfirmed: boolean;
  readonly coordinates: readonly [number, number];
}

export interface FeaturedMarket {
  readonly location: MarketLocation;
  readonly label: 'Estamos hoje' | 'Próxima feira';
}

@Injectable({
  providedIn: 'root',
})
export class MarketScheduleService {
  readonly locations = signal<readonly MarketLocation[]>([
    {
      id: 'agua-verde',
      day: 'Terça-feira',
      dayIndex: 2,
      title: 'Feira do Água Verde',
      address: 'Rua Dom Pedro I',
      neighborhood: 'Água Verde',
      city: 'Curitiba',
      state: 'Paraná',
      startTime: '07:30',
      endTime: '11:30',
      isAddressConfirmed: true,
      coordinates: [-25.4590243, -49.2832179],
    },
    {
      id: 'juveve',
      day: 'Terça-feira',
      dayIndex: 2,
      title: 'Feira do Juvevê',
      address: 'Avenida Anita Garibaldi com Rua Campos Salles',
      neighborhood: 'Juvevê',
      city: 'Curitiba',
      state: 'Paraná',
      startTime: '17:00',
      endTime: '20:30',
      isAddressConfirmed: true,
      coordinates: [-25.4108025, -49.2575918],
    },
    {
      id: 'bigorrilho',
      day: 'Quarta-feira',
      dayIndex: 3,
      title: 'Feira do Bigorrilho',
      address: 'Rua Martin Pena',
      neighborhood: 'Bigorrilho',
      city: 'Curitiba',
      state: 'Paraná',
      startTime: '07:30',
      endTime: '11:30',
      isAddressConfirmed: true,
      coordinates: [-25.4366401, -49.2959418],
    },
    {
      id: 'batel',
      day: 'Quinta-feira',
      dayIndex: 4,
      title: 'Feira do Batel',
      address: 'Alameda Dom Pedro II',
      neighborhood: 'Batel',
      city: 'Curitiba',
      state: 'Paraná',
      startTime: '07:30',
      endTime: '11:30',
      isAddressConfirmed: true,
      coordinates: [-25.439013, -49.2849084],
    },
    {
      id: 'vila-hauer',
      day: 'Sábado',
      dayIndex: 6,
      title: 'Feira do Hauer',
      address: 'Praça da Passarela, Praça Dr. Joaquim Menelau de Almeida Torres',
      neighborhood: 'Hauer',
      city: 'Curitiba',
      state: 'Paraná',
      startTime: '08:00',
      endTime: '13:00',
      isAddressConfirmed: true,
      coordinates: [-25.4846908, -49.2452823],
    },
    {
      id: 'domingo',
      day: 'Domingo',
      dayIndex: 0,
      title: 'Feira de Domingo',
      address: 'Praça 29 de Março',
      neighborhood: 'Curitiba',
      city: 'Curitiba',
      state: 'Paraná',
      startTime: '08:00',
      endTime: '13:00',
      isAddressConfirmed: true,
      coordinates: [-25.4287646, -49.2861641],
    },
  ]);

  getFeaturedMarket(now = new Date()): FeaturedMarket {
    const currentDay = this.getCuritibaDayIndex(now);
    const currentMinutes = this.getCuritibaMinutes(now);
    const locations = this.locations();

    const current = locations.find((location) => {
      const start = this.toMinutes(location.startTime);
      const end = this.toMinutes(location.endTime);

      return location.dayIndex === currentDay && currentMinutes >= start && currentMinutes < end;
    });

    if (current) {
      return {
        location: current,
        label: 'Estamos hoje',
      };
    }

    const next = locations
      .map((location) => ({
        location,
        distance: this.getStartDistance(location, currentDay, currentMinutes),
      }))
      .sort((a, b) => a.distance - b.distance)[0].location;

    return {
      location: next,
      label: 'Próxima feira',
    };
  }

  formatTimeRange(location: MarketLocation): string {
    return `${location.startTime} - ${location.endTime}`;
  }

  private getStartDistance(location: MarketLocation, currentDay: number, currentMinutes: number): number {
    const start = this.toMinutes(location.startTime);
    const dayDistance = (location.dayIndex - currentDay + 7) % 7;

    if (dayDistance === 0 && start <= currentMinutes) {
      return 7 * 24 * 60 - currentMinutes + start;
    }

    return dayDistance * 24 * 60 + start - currentMinutes;
  }

  private getCuritibaDayIndex(date: Date): number {
    const weekday = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo',
      weekday: 'short',
    })
      .formatToParts(date)
      .find((part) => part.type === 'weekday')?.value;

    const weekdayIndexes: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };

    return weekdayIndexes[weekday ?? 'Sun'];
  }

  private getCuritibaMinutes(date: Date): number {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(date);

    const hour = Number(parts.find((part) => part.type === 'hour')?.value);
    const minute = Number(parts.find((part) => part.type === 'minute')?.value);

    return hour * 60 + minute;
  }

  private toMinutes(value: string): number {
    const [hour, minute] = value.split(':').map(Number);

    return hour * 60 + minute;
  }
}
