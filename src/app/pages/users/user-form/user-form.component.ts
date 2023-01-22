import { AppRoleDto } from './../../../@core/dtos/role.dto';
import { NbDialogRef } from '@nebular/theme';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { isEmail, isMobilePhone } from 'class-validator';
import { RoleService } from 'src/app/@core/data-services/role.service';
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { RoleMap } from 'src/app/@core/maps/role.map';
import { PermissionService } from 'src/app/@core/utils/permission.service';
import { ClientDto } from 'src/app/@core/dtos/client.dto';
import { ClientService } from 'src/app/@core/data-services/client.service';
import { UsersResources } from '../users-resources';
import { TokenService } from 'src/app/@core/utils/token.service';
import { UserModel } from 'src/app/@core/models/user.model';
import { UserService } from 'src/app/@core/data-services/user.service';
import { PostUserDto } from 'src/app/@core/dtos/post-user.dto';
import { ResponseDto } from 'src/app/@core/dtos/response-dto';
import { UserDto } from 'src/app/@core/dtos/user.dto';
import { UpdateUserDto } from 'src/app/@core/dtos/update-user.dto';

@Component({
  selector: 'app-create-users',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [UntypedFormBuilder]
})
export class UserFormComponent implements OnInit, OnDestroy {

  @Input()
  isCreateRequest = true;

  @Input()
  userForUpdate!: UserDto;

  errors: string[] = [];
  messages: string[] = [];
  submitted = false;

  createUserForm!: UntypedFormGroup

  appRoles$: Observable<AppRoleDto[]>;
  ssoRoles$: Observable<string[]>;
  clients$: Observable<ClientDto[]>;

  roleMap = RoleMap;
  userResources = UsersResources;
  isLive = true;

  constructor(
    private roleService: RoleService,
    private clientService: ClientService,
    public dialogRef: NbDialogRef<UserFormComponent>,
    private formBuilder: UntypedFormBuilder,
    public permissionService: PermissionService,
    private tokenService: TokenService,
    private userService: UserService

  ) {
    this.appRoles$ = this.roleService.getAppRoles().pipe(map(d => d.data as AppRoleDto[]));
    this.clients$ = this.clientService.getClients().pipe(map(d => d.data?.itemList as ClientDto[]));
    this.ssoRoles$ = this.roleService.getSsoRoles()
      .pipe(
        map(d => d.data as string[]),
        map(roles => roles.filter(r => this.permissionService.canAccessByResource('create', 'users:create-' + r)))
      );
  }

  ngOnInit(): void {
    if (this.isCreateRequest) {
      this.initCreateForm();
    } else {
      this.initUpdateForm();
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  initCreateForm(): void {
    const userModel: UserModel = JSON.parse(this.tokenService.getPayload().sub);
    this.createUserForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [
        Validators.required,
        this.validateEmail.bind(this)
      ]],
      phoneNumber: [
        '', [
          Validators.required,
          this.validatePhoneNumber.bind(this)
        ]
      ],
      roleId: ['', Validators.required],
      ssoRole: [
        '', [
          Validators.required,
          this.validateSsoRole.bind(this)
        ]
      ],
      clientId: [
        this.permissionService.canAccessByResource('create', UsersResources.SetClient) ? '' : userModel.clientId
        , Validators.required
      ],
    });

    this.createUserForm.get('clientId')?.valueChanges
      .pipe(takeWhile(() => this.isLive))
      .subscribe(
        (v) => {
          this.createUserForm.get('email')?.updateValueAndValidity();
          this.createUserForm.get('ssoRole')?.updateValueAndValidity();
        }
      )
  }

  initUpdateForm(): void {
    this.createUserForm = this.formBuilder.group({
      firstName: [this.userForUpdate.firstName, Validators.required],
      lastName: [this.userForUpdate.lastName, Validators.required],
      phoneNumber: [
        this.userForUpdate.phone, [
          Validators.required,
          this.validatePhoneNumber.bind(this)
        ]
      ],
      roleId: [this.userForUpdate.roleId, Validators.required],
    });

  }

  validatePhoneNumber(input: UntypedFormControl) {
    const value = input.value as string;
    const isValidPhoneNos = isMobilePhone(value.trim(), 'en-NG');
    if (isValidPhoneNos) {
      return;
    } else {
      return {
        phoneNos: `"${value}" is not a valid phone number`
      }
    }
  }

  validateEmail(input: UntypedFormControl) {
    const value = (input.value as string).trim();
    const isValidEmail = isEmail(value);
    if (!isValidEmail) {
      return {
        email: `"${value}" is not a valid email`
      }
    }

    const userModel: UserModel = JSON.parse(this.tokenService.getPayload().sub);
    const clientId = this.createUserForm.get('clientId')?.value;
    const ssoRole = userModel.ssoRole;
    const signedInUserClientId = userModel.clientId;
    const emailHasVggSignature = (value as string).trim().toLowerCase().endsWith('@venturegardengroup.com');

    // continue only if VGG staff is signed in
    if (!ssoRole.trim().includes('vgg')) {
      return;
    }

    // if VGG Client Selected, 
    if (clientId === signedInUserClientId && !emailHasVggSignature) {
      return {
        email: `"${value}" is not a valid VGG email`
      }
    }

    // if Non VGG Client is Selected
    if (clientId !== signedInUserClientId && emailHasVggSignature) {
      return {
        email: `"${value}" cannot be used for client account`
      }
    }
    return;
  }

  validateSsoRole(input: UntypedFormControl) {
    const value = (input.value as string).trim();
    const userModel: UserModel = JSON.parse(this.tokenService.getPayload().sub);
    const clientId = this.createUserForm?.get('clientId')?.value;
    const ssoRole = userModel.ssoRole;
    const signedInUserClientId = userModel.clientId;
    const isVggSsoRole = value.includes('vgg');

    // continue only if VGG staff is signed in
    if (!clientId?.length) {
      return;
    }

    // continue only if VGG staff is signed in
    if (!ssoRole.trim().includes('vgg')) {
      return;
    }

    // if VGG Client Selected, 
    if (clientId === signedInUserClientId && !isVggSsoRole) {
      return {
        sso: `This role cannot be assigned to a VGG client account`
      }
    }

    // if Non VGG Client is Selected
    if (clientId !== signedInUserClientId && isVggSsoRole) {
      return {
        sso: `This role can only be assigned to a VGG client account`
      }
    }

    return;
  }

  saveUser(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    const postUserDto: PostUserDto = {
      firstName: (this.createUserForm.get('firstName')?.value as string).trim(),
      lastName: (this.createUserForm.get('lastName')?.value as string).trim(),
      email: (this.createUserForm.get('email')?.value as string).trim(),
      phoneNumber: (this.createUserForm.get('phoneNumber')?.value as string).trim(),
      roleId: this.createUserForm.get('roleId')?.value,
      clientId: this.createUserForm.get('clientId')?.value,
      ssoRole: this.createUserForm.get('ssoRole')?.value,
    }

    this.userService.postUser(postUserDto).subscribe(
      (result) => {
        this.submitted = false;
        if (result.status) {
          this.messages = ['User creation successful'];
          setTimeout(() => {
            this.dialogRef.close(result.data)
          }, 1200);
        } else {
          this.errors = [
            result.message as string
          ];
        }
      },
      (error: ResponseDto<string>) => {
        this.submitted = false;
        this.errors = [
          'An Error occured while logging you in.',
        ];
      }
    );
  }

  updateUser(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    const updateUserDto: UpdateUserDto = {
      firstName: (this.createUserForm.get('firstName')?.value as string).trim(),
      lastName: (this.createUserForm.get('lastName')?.value as string).trim(),
      phoneNumber: (this.createUserForm.get('phoneNumber')?.value as string).trim(),
      appRole: this.createUserForm.get('roleId')?.value,
      id: this.userForUpdate.id
    }

    this.userService.updateUser(updateUserDto).subscribe(
      (result) => {
        this.submitted = false;
        if (result.status) {
          this.messages = ['User record updated successful'];
          setTimeout(() => {
            this.dialogRef.close(result.data)
          }, 1200);
        } else {
          this.errors = [
            result.message as string
          ];
        }
      },
      (error: ResponseDto<string>) => {
        this.submitted = false;
        this.errors = [
          'An Error occured while logging you in.',
        ];
      }
    );
  }

  ngOnDestroy() {
    this.isLive = false;
  }

}
