import { Injectable, inject } from '@angular/core';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { API_ENDPOINTS } from '../../../core/constants/app.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayrollRulesService {
  private http = inject(BaseHttpService);

  getRule(): Observable<any> {
    return this.http.get(`${API_ENDPOINTS.PAYROLL}/rules`);
  }

  upsertRule(payload: any): Observable<any> {
    return this.http.post(`${API_ENDPOINTS.PAYROLL}/rules`, payload);
  }

  getRuns(): Observable<any> {
    return this.http.get(`${API_ENDPOINTS.PAYROLL}/runs`);
  }

  previewRun(period: string): Observable<any> {
    return this.http.get(`${API_ENDPOINTS.PAYROLL}/runs/preview?period=${period}`);
  }

  executeRun(payload: any): Observable<any> {
    return this.http.post(`${API_ENDPOINTS.PAYROLL}/runs/execute`, payload);
  }
}
