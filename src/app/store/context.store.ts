import { Injectable, signal, computed } from '@angular/core';

const ACTIVE_BRANCH_KEY = 'hrms_active_branch';

@Injectable({
    providedIn: 'root'
})
export class ContextStore {
    private activeBranchIdSignal = signal<string | null>(this.loadActiveBranch());

    readonly activeBranchId = computed(() => this.activeBranchIdSignal());

    setActiveBranch(branchId: string | null) {
        this.activeBranchIdSignal.set(branchId);
        if (branchId) {
            localStorage.setItem(ACTIVE_BRANCH_KEY, branchId);
        } else {
            localStorage.removeItem(ACTIVE_BRANCH_KEY);
        }
    }

    private loadActiveBranch(): string | null {
        try {
            return localStorage.getItem(ACTIVE_BRANCH_KEY);
        } catch {
            return null;
        }
    }
}
