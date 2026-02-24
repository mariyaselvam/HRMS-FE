import { Injectable, inject } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    success(summary: string, detail: string = ''): void {
        this.messageService.add({
            severity: 'success',
            summary,
            detail,
            life: 3000
        });
    }

    error(summary: string, detail: string = ''): void {
        this.messageService.add({
            severity: 'error',
            summary,
            detail,
            life: 5000
        });
    }

    info(summary: string, detail: string = ''): void {
        this.messageService.add({
            severity: 'info',
            summary,
            detail,
            life: 3000
        });
    }

    warn(summary: string, detail: string = ''): void {
        this.messageService.add({
            severity: 'warn',
            summary,
            detail,
            life: 3000
        });
    }

    confirm(message: string, header: string = 'Confirmation', accept: () => void, reject?: () => void): void {
        this.confirmationService.confirm({
            message,
            header,
            icon: 'pi pi-exclamation-triangle',
            accept,
            reject
        });
    }

    confirmDelete(name: string, accept: () => void): void {
        this.confirm(
            `Are you sure you want to delete ${name}?`,
            'Delete Confirmation',
            accept
        );
    }
}
