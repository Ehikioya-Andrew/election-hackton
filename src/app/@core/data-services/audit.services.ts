import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccessControlContract } from '../data-contracts/access-control-contract';
import { ListDto } from '../dtos/list.dto';
import { ResponseDto } from '../dtos/response-dto';
import { PermissionService } from '../utils/permission.service';
import { AuditDto } from '../dtos/audit.dto';
import { ReportDownloadAuditDto } from '../dtos/report-download-audit.dto';

@Injectable({
  providedIn: 'root',
})
export class AuditService implements AccessControlContract {
  constructor(
    private httpClient: HttpClient,
    public permissionService: PermissionService
  ) {}

  getAudit(
    filter: any = { page: 1, size: environment.paginationLength }
  ): Observable<ResponseDto<ListDto<AuditDto>>> {
    const apiEndpoint = 'Audit';
    let params = new HttpParams();
    for (const key in filter) {
      params = params.set(key, filter[key]);
    }
    return this.httpClient.get<ResponseDto<ListDto<AuditDto>>>(
      `${''}/${apiEndpoint}`,
      { params }
    );
  }

  postLogout(): Observable<any> {
    const apiEndpoint = 'Auth/postLogOut';
    return this.httpClient.post<any>(`${''}/${apiEndpoint}`, null);
  }
}
