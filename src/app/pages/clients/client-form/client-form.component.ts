import { TokenService } from 'src/app/@core/utils/token.service';
import { ClientDto } from 'src/app/@core/dtos/client.dto';
import { ResponseDto } from 'src/app/@core/dtos/response-dto';
import { PostClientDto } from './../../../@core/dtos/post-client.dto';
import { ClientService } from 'src/app/@core/data-services/client.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { isEmail, isMobilePhone, MinLength, minLength, validate } from 'class-validator';
import { UpdateClientDto } from 'src/app/@core/dtos/update-client.dto';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
  providers: [UntypedFormBuilder]
})
export class ClientFormComponent implements OnInit, OnDestroy {
  @Input()
  isCreateRequest = true;

  @Input()
  clientForUpdate!: ClientDto;


  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  userName: string = '';
  disableUserName = true;

  clientForm!: UntypedFormGroup;

  constructor(
    public dialogRef: NbDialogRef<ClientFormComponent>,
    private formBuilder: UntypedFormBuilder,
    private clientService: ClientService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    if (this.isCreateRequest) {
      this.initCreateForm();
    } else {
      this.initUpdateForm();
    }
    this.clientForm.controls['userName'].disable();
  }

  ngOnDestroy(): void {
    console.log('')
  }

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
  initCreateForm(): void {
    this.clientForm = this.formBuilder.group({
      businessName: ['', Validators.required],
      address: ['', Validators.required],
      userName: ['', Validators.required],
      city: ['', Validators.required],
      role: [null, [Validators.required, Validators.min(3)]],
      contactPerson: ['', Validators.required],
      contactEmail: ['', [
        Validators.required,
        this.validateEmail.bind(this)
      ]],
      phoneNumber: [
        '', [
          Validators.required,
          this.validatePhoneNumber.bind(this)
        ]
      ],
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
    if (isValidEmail) {
      return;
    } else {
      return {
        contactEmail: `"${value}" is not a valid email`
      }
    }
  }

  saveClient(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    const postClientDto: PostClientDto = {
      businessName: (this.clientForm.get('businessName')?.value as string).trim(),
      address: (this.clientForm.get('address')?.value as string).trim(),
      userName: (this.clientForm.get('userName')?.value as string).trim(),
      city: (this.clientForm.get('city')?.value as string).trim(),
      contactEmail: (this.clientForm.get('contactEmail')?.value as string).trim(),
      contactPerson: (this.clientForm.get('contactPerson')?.value as string).trim(),
      jobRole: (this.clientForm.get('role')?.value as string).trim(),
      contactPhone: (this.clientForm.get('phoneNumber')?.value as string).trim(),
    }

    this.clientService.postClient(postClientDto).subscribe(
      (result) => {
        this.submitted = false;
        if (result.status) {
          this.messages = ['Client creation successful'];
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
          'An Error occured while creating client.',
        ];
      }
    );
  }

  initUpdateForm(): void {
    this.clientForm = this.formBuilder.group({
      businessName: [this.clientForUpdate.businessName, Validators.required],
      address: [this.clientForUpdate.address, Validators.required],
      userName: [this.clientForUpdate.userName, Validators.required],
      city: [this.clientForUpdate.city, Validators.required],

      roleId: [this.clientForUpdate.id, Validators.required],
      role: [this.clientForUpdate.jobRole, Validators.required],
      contactPerson: [this.clientForUpdate.contactPerson, Validators.required],
      contactEmail: [this.clientForUpdate.contactEmail, [
        Validators.required,
        this.validateEmail.bind(this)
      ]],
      phoneNumber: [
        this.clientForUpdate.contactPhone, [
          Validators.required,
          this.validatePhoneNumber.bind(this)
        ]
      ],
    });
  }

  updateClient(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    const updateClientDto: UpdateClientDto = {
      businessName: (this.clientForm.get('businessName')?.value as string).trim(),
      address: (this.clientForm.get('address')?.value as string).trim(),
      userName: (this.clientForm.get('userName')?.value as string).trim().toLowerCase().split(' ').join('.'),
      city: (this.clientForm.get('city')?.value as string).trim(),
      contactEmail: (this.clientForm.get('contactEmail')?.value as string).trim(),
      contactPerson: (this.clientForm.get('contactPerson')?.value as string).trim(),
      contactPhone: (this.clientForm.get('phoneNumber')?.value as string).trim(),
      jobRole: (this.clientForm.get('role')?.value as string).trim(),
      clientId: this.clientForUpdate.clientId
    }

    this.clientService.updateClient(updateClientDto).subscribe(
      (result) => {
        this.submitted = false;
        if (result.status) {
          this.messages = ['Client record updated successfully'];
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
          'An Error occured while editing client.',
        ];
      }
    );
  }

  getBusinessUsername(v: string) {
    return v.trim().replace(/[^\w\s]/gi, '').toLowerCase().split(' ').filter(c => /[a-z]/.test(c)).join('.');
  }
}

