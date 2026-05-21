import { Component, inject, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DashboardStore } from '../../store/dashboard.store';
import { ContextStore } from '../../store/context.store';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule, ChartModule],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    protected store = inject(DashboardStore);
    protected contextStore = inject(ContextStore);

    constructor() {
        effect(() => {
            const branchId = this.contextStore.activeBranchId();
            this.store.loadSummary(branchId || undefined);
        });
    }

    chartData = computed(() => {
        const overview = this.store.summary()?.attendance?.overview || [];
        
        const labels = overview.map(d => {
            const dateObj = new Date(d.date);
            return dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        });

        const presentData = overview.map(d => d.present);
        const absentData = overview.map(d => d.absent);
        const lateData = overview.map(d => d.late);

        return {
            labels,
            datasets: [
                {
                    label: 'Present',
                    backgroundColor: '#10b981',
                    borderColor: '#10b981',
                    data: presentData,
                    borderRadius: 6
                },
                {
                    label: 'Late',
                    backgroundColor: '#f59e0b',
                    borderColor: '#f59e0b',
                    data: lateData,
                    borderRadius: 6
                },
                {
                    label: 'Absent',
                    backgroundColor: '#ef4444',
                    borderColor: '#ef4444',
                    data: absentData,
                    borderRadius: 6
                }
            ]
        };
    });

    chartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: '#64748b',
                    font: {
                        family: 'Inter',
                        weight: '500'
                    }
                },
                position: 'bottom'
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#64748b',
                    font: {
                        family: 'Inter'
                    }
                },
                grid: {
                    display: false
                }
            },
            y: {
                ticks: {
                    color: '#64748b',
                    stepSize: 1,
                    font: {
                        family: 'Inter'
                    }
                },
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                    drawTicks: false
                }
            }
        }
    };
}
