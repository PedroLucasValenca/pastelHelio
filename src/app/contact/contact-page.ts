import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { LucideAtSign, LucideMail, LucideMapPin, LucideMessageCircle, LucidePhone } from '@lucide/angular';

interface ContactOption {
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'ph-contact-page',
  imports: [LucideAtSign, LucideMail, LucideMapPin, LucideMessageCircle, LucidePhone],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent {
  private readonly whatsappPhone = '5541999999999';
  private readonly contactEmail = 'contato@pasteldohelio.com.br';

  protected readonly instagramUrl = 'https://www.instagram.com/pasteldohelio/';
  protected readonly contactName = signal('');
  protected readonly contactInfo = signal('');
  protected readonly message = signal('');

  protected readonly contactOptions: readonly ContactOption[] = [
    {
      title: 'Pedidos e delivery',
      description: 'Fale com a equipe para combinar retirada, entrega e detalhes do seu pedido.',
    },
    {
      title: 'Eventos e encomendas',
      description: 'Conte a data, quantidade estimada e local para montarmos o atendimento.',
    },
    {
      title: 'Agenda e locais',
      description: 'Veja onde estamos hoje ou confirme os pontos de feira e eventos.',
    },
  ];

  protected readonly whatsappUrl = computed(() => {
    return `https://wa.me/${this.whatsappPhone}?text=${this.encodedMessage()}`;
  });

  protected readonly emailUrl = computed(() => {
    return `mailto:${this.contactEmail}?subject=${encodeURIComponent('Fale conosco - Pastel do Hélio')}&body=${this.encodedMessage()}`;
  });

  protected updateContactName(event: Event): void {
    this.contactName.set(this.getFieldValue(event));
  }

  protected updateContactInfo(event: Event): void {
    this.contactInfo.set(this.getFieldValue(event));
  }

  protected updateMessage(event: Event): void {
    this.message.set(this.getFieldValue(event));
  }

  private encodedMessage(): string {
    const message = [
      'Olá, Pastel do Hélio!',
      `Nome: ${this.contactName() || 'Não informado'}`,
      `Contato: ${this.contactInfo() || 'Não informado'}`,
      `Mensagem: ${this.message() || 'Quero falar com a equipe.'}`,
    ].join('\n');

    return encodeURIComponent(message);
  }

  private getFieldValue(event: Event): string {
    const field = event.target as HTMLInputElement | HTMLTextAreaElement | null;

    return field?.value.trim() ?? '';
  }
}
