import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { LucideCalendarDays, LucideMail, LucideMessageCircle, LucidePartyPopper, LucideUsers } from '@lucide/angular';

interface EventSuggestion {
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'ph-events-page',
  imports: [LucideCalendarDays, LucideMail, LucideMessageCircle, LucidePartyPopper, LucideUsers],
  templateUrl: './events-page.html',
  styleUrl: './events-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsPageComponent {
  private readonly whatsappPhone = '5541999999999';
  private readonly contactEmail = 'contato@pasteldohelio.com.br';

  protected readonly contactName = signal('');
  protected readonly contactInfo = signal('');
  protected readonly requestDetails = signal('');

  protected readonly eventSuggestions: readonly EventSuggestion[] = [
    {
      title: 'Eventos corporativos',
      description: 'Coffee breaks, confraternizações, reuniões de equipe e ações para clientes.',
    },
    {
      title: 'Festas juninas e julinas',
      description: 'Pastel crocante para barraquinhas, escolas, igrejas, condomínios e arraiais.',
    },
    {
      title: 'Casamentos e aniversários',
      description: 'Serviço para recepção, pista, mesa de apoio ou ponto de pastel feito no evento.',
    },
    {
      title: 'Eventos no local',
      description: 'Levamos a estrutura do Pastel do Hélio para atender seus convidados no espaço do evento.',
    },
  ];

  protected readonly whatsappUrl = computed(() => {
    return `https://wa.me/${this.whatsappPhone}?text=${this.encodedMessage()}`;
  });

  protected readonly emailUrl = computed(() => {
    return `mailto:${this.contactEmail}?subject=${encodeURIComponent('Eventos e encomendas - Pastel do Hélio')}&body=${this.encodedMessage()}`;
  });

  protected updateContactName(event: Event): void {
    this.contactName.set(this.getFieldValue(event));
  }

  protected updateContactInfo(event: Event): void {
    this.contactInfo.set(this.getFieldValue(event));
  }

  protected updateRequestDetails(event: Event): void {
    this.requestDetails.set(this.getFieldValue(event));
  }

  private encodedMessage(): string {
    const message = [
      'Olá, Pastel do Hélio!',
      `Nome: ${this.contactName() || 'Não informado'}`,
      `Contato: ${this.contactInfo() || 'Não informado'}`,
      `Pedido/evento: ${this.requestDetails() || 'Quero falar sobre eventos ou encomendas.'}`,
      'Observação: encomendas a partir de 20 pastéis e com pelo menos 1 dia de antecedência.',
    ].join('\n');

    return encodeURIComponent(message);
  }

  private getFieldValue(event: Event): string {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement | null;

    return field?.value.trim() ?? '';
  }
}
