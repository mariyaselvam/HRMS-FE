import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        ButtonModule,
        InputTextModule,
        ToastModule,
        ConfirmDialogModule,
        SidebarComponent
    ],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
    title = 'hrms-fe';
    authService = inject(AuthService);
    themeService = inject(ThemeService);

    onLogout(): void {
        this.authService.logout();
    }
}
