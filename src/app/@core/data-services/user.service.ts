// import { Observable } from 'rxjs';
// import { Injectable } from '@angular/core';
// import { PermissionService } from '../utils/permission.service';
// import { AccessControlContract } from '../data-contracts/access-control-contract';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
// import { ResponseDto } from '../dtos/response-dto';
// import { ListDto } from '../dtos/list.dto';
// import { UserDto } from '../dtos/user.dto';
// import { PostUserDto } from '../dtos/post-user.dto';
// import { HasAccess } from '../decorators/has-access.decorator';
// import { PermissionEnum } from '../enums/permission.enum';
// import { UsersResources } from 'src/app/pages/users/users-resources';
// import { UpdateUserDto } from '../dtos/update-user.dto';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService implements AccessControlContract {

//   constructor(
//     private httpClient: HttpClient,
//     public permissionService: PermissionService
//   ) { }

//   getUsers(filter: any = { page: 1, size: environment.paginationLength }): Observable<ResponseDto<ListDto<UserDto>>> {
//     const apiEndpoint = 'users';
//     let params = new HttpParams()
//     for (const key in filter) {
//       params = params.set(key, filter[key])
//     }
//     return this.httpClient.get<ResponseDto<ListDto<UserDto>>>(`${environment.apiUrl}/${apiEndpoint}`, { params });
//   }

//   @HasAccess(PermissionEnum.Create, UsersResources.CreateUsers)
//   postUser(user: PostUserDto): Observable<ResponseDto<UserDto>> {
//     const apiEndpoint = 'users';
//     return this.httpClient.post<ResponseDto<UserDto>>(`${environment.apiUrl}/${apiEndpoint}`, user);
//   }

//   @HasAccess(PermissionEnum.Update, UsersResources.UpdateUsers)
//   updateUser(user: UpdateUserDto): Observable<ResponseDto<any>> {
//     const apiEndpoint = `users/${user.id}`;
//     return this.httpClient.put<ResponseDto<any>>(`${environment.apiUrl}/${apiEndpoint}`, user);
//   }

//   @HasAccess(PermissionEnum.Update, UsersResources.UpdateUsers)
//     enableUser(id: string): Observable<ResponseDto<any>> {
//     const apiEndpoint = `users/enable/${id}`;
//     return this.httpClient.put<ResponseDto<any>>(`${environment.apiUrl}/${apiEndpoint}`, null);
//   }

//   @HasAccess(PermissionEnum.Update, UsersResources.UpdateUsers)
//   disableUser(id: string): Observable<ResponseDto<any>> {
//     const apiEndpoint = `users/disable/${id}`;
//     return this.httpClient.put<ResponseDto<any>>(`${environment.apiUrl}/${apiEndpoint}`, null);
//   }
// }
