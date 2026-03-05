import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DashboardStore } from '../../store/dashboard.store';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    protected store = inject(DashboardStore);

    ngOnInit() {
        this.store.loadSummary();
    }
}
