import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeliveryScheduleService {
  isDeliveryVisible(now = new Date()): boolean {
    const dayIndex = this.getCuritibaDayIndex(now);
    const minutes = this.getCuritibaMinutes(now);

    if (dayIndex < 1 || dayIndex > 5) {
      return false;
    }

    const previewStart = this.toMinutes('16:40');
    const closeTime = this.toMinutes(dayIndex === 5 ? '22:00' : '21:00');

    return minutes >= previewStart && minutes < closeTime;
  }

  getDeliveryTimeLabel(now = new Date()): string {
    return this.getCuritibaDayIndex(now) === 5 ? '17:00 - 22:00' : '17:00 - 21:00';
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
