import { Component, output, computed } from '@angular/core';
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
    authService = inject(AuthService);
    readonly appTitle: string = SIDEBAR_APP_TITLE;

    readonly navItems = computed(() => {
        const userRole = this.authService.userRole().toLowerCase();
        return SIDEBAR_NAV_ITEMS.filter(item =>
            !item.roles || item.roles.includes(userRole)
        );
    });

    logout = output<void>();

    onLogout(): void {
        this.logout.emit();
    }
}
