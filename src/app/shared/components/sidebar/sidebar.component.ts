import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SIDEBAR_NAV_ITEMS, SIDEBAR_APP_TITLE, SidebarNavItem } from '../../../core/constants/sidebar.constants';
import { inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    readonly navItems: SidebarNavItem[] = SIDEBAR_NAV_ITEMS;
    readonly appTitle: string = SIDEBAR_APP_TITLE;
    authService = inject(AuthService);

    logout = output<void>();

    onLogout(): void {
        this.logout.emit();
    }
}
