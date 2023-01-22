import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbGlobalPhysicalPosition, NbTagComponent, NbToastrService } from '@nebular/theme';
import { forkJoin, merge, Observable, of } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { GeneratingSetsService } from 'src/app/@core/data-services/generating-set.service';
import { LoadPointService } from 'src/app/@core/data-services/load-point.service';
import { NotificationService } from 'src/app/@core/data-services/notification.service';
import { PowerSourceService } from 'src/app/@core/data-services/power-source.service';
import { UserService } from 'src/app/@core/data-services/user.service';
import { NotificationCategoryDto } from 'src/app/@core/dtos/notification-category.dto';
import { NotificationDto, Recipient } from 'src/app/@core/dtos/notifications.dto';
import { PostNotificationDto } from 'src/app/@core/dtos/post-notification.dto';
import { ResponseDto } from 'src/app/@core/dtos/response-dto';
import { UpdateNotificationDto } from 'src/app/@core/dtos/update-notification.dto';
import { UserDto } from 'src/app/@core/dtos/user.dto';
import { AssetTypeComsumption, AssetTypeNotification, AssetTypeOutage, AssetTypeReport, NoticeMessage, NotificationTypeDuration } from 'src/app/@core/enums/asset-type.enum';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { UserModel } from 'src/app/@core/models/user.model';
import { PermissionService } from 'src/app/@core/utils/permission.service';
import { TokenService } from 'src/app/@core/utils/token.service';

@Component({
  selector: 'app-notification-form',
  templateUrl: './notification-form.component.html',
  styleUrls: ['./notification-form.component.scss']
})
export class NotificationFormComponent implements OnInit, OnDestroy {
  @Input()
  isCreateRequest: boolean = true;

  submitted: boolean = false;

  startDate!: Date;

  @Input()
  NotificationFormUpdate!: NotificationDto

  @Input()
  categoryData: NotificationCategoryDto[] = [];

  updateNotificationForm!: UntypedFormGroup

  createNotificationForm!: UntypedFormGroup
  createNotificationConsumption!: UntypedFormGroup
  createNotificationOutage!: UntypedFormGroup
  createNotificationReport!: UntypedFormGroup

  errors: string[] = [];
  messages: string[] = [];

  notificationTypeName: NotificationCategoryDto[] = [];

  payload!: PostNotificationDto;
  updatePayload!: UpdateNotificationDto

  notificationTypeDuration = Array.from(NotificationTypeDuration);

  AssetTypeReport = Array.from(AssetTypeReport);
  AssetTypeComsumption = Array.from(AssetTypeComsumption)
  AssetTypeOutage = Array.from(AssetTypeOutage)
  noticeMsg!: string;

  noticeMessage: Map<string, any> = NoticeMessage;

  notificationType!: number;

  assetType!: AssetTypeNotification;

  filteredOptions$: Observable<any[]> = of([]);
  filteredOptionUsers$: Observable<any[]> = of([]);

  options: any[] = [];
  optionUsers: UserDto[] = [];

  users: UserDto[] = [];
  userArray: Recipient[] = []
  duration!: string;
  interval!: string;
  userType!: boolean;
  locationId!: string;

  isLive = true;
  isLoadingData = false;
  constructor(
    public dialogRef: NbDialogRef<NotificationFormComponent>,
    private formBuilder: UntypedFormBuilder,
    public permissionService: PermissionService,
    private loadpointService: LoadPointService,
    private genSetService: GeneratingSetsService,
    private powerSourceService: PowerSourceService,
    private userService: UserService,
    private tokenService: TokenService,
    private notificationService: NotificationService,
    private toastr: NbToastrService,
  ) {

  }


  ngOnInit(): void {

    this.notificationTypeName = this.categoryData
    const userModel: UserModel = JSON.parse(this.tokenService.getPayload().sub);
    userModel.ssoRole === 'clientadmin' ? this.userType = true : this.userType = false;

    this.startDate = new Date();

    if (this.isCreateRequest) {
      this.initCreateForm();
      this.initCreateOutageForm()
      this.initCreateReportForm()
      this.initCreateConsumptionForm()
    } else {
      this.initCreateForm();
      this.initCreateOutageForm()
      this.initCreateReportForm()
      this.initCreateConsumptionForm()
      this.initUpdateForm();
    }
    // for Report Search
    this.createNotificationReport.get('location')?.valueChanges.pipe(takeWhile(() => this.isLive)).subscribe((data) => {
      this.filteredOptions$ = this.getFilteredOptions(data);
    });

    // for Outage Search
    this.createNotificationOutage.get('location')?.valueChanges.pipe(takeWhile(() => this.isLive)).subscribe((data) => {
      this.filteredOptions$ = this.getFilteredOptions(data);
    });

    // for consumption search
    this.createNotificationConsumption.get('location')?.valueChanges.pipe(takeWhile(() => this.isLive)).subscribe((data) => {
      this.filteredOptions$ = this.getFilteredOptions(data);
    });
    // for user Search
    this.createNotificationReport.get('user')?.valueChanges.pipe(takeWhile(() => this.isLive)).subscribe((data) => {
      this.filteredOptionUsers$ = this.getFilteredOptionUsers(data);
    });

    // for user Search
    this.createNotificationOutage.get('user')?.valueChanges.pipe(takeWhile(() => this.isLive)).subscribe((data) => {
      this.filteredOptionUsers$ = this.getFilteredOptionUsers(data);
    });

    // for consumption user search search
    this.createNotificationConsumption.get('user')?.valueChanges.pipe(takeWhile(() => this.isLive)).subscribe((data) => {
      this.filteredOptionUsers$ = this.getFilteredOptionUsers(data);
    });

    this.filteredOptions$ = this.callService();
    this.filteredOptionUsers$ = this.userData();
  }

  userData(data?: any) {
    return this.userService.getUsers(data).pipe(map((d) => {
      const response = d.data?.itemList ?? [];
      this.optionUsers = GetUniqueArray(response, this.optionUsers)
      return response
    }));
  }

  getFilteredOptionUsers(value: string) {
    return merge(
      of(this.optionUsers).pipe(
        map(arr => {
          return arr.filter(d => ((d.firstName).toLowerCase()?.includes(value) || (d.lastName).toLowerCase()?.includes(value)))
        })
      ),
      forkJoin([
        this.userData({ firstName: (value ?? '').toLowerCase() }),
        this.userData({ lastName: (value ?? '').toLowerCase() }),
      ]).pipe(map((data) => GetUniqueArray(data[0], data[1])))
    );
  }

  getFilteredOptions(value: string) {
    return merge(
      of(this.options).pipe(
        map(arr => {
          return arr.filter(d => (d.name.includes(value) || d.meter?.includes(value)))
        })
      ),
      forkJoin([
        this.callService({ name: (value ?? '').toLowerCase() }),
        this.callService({ meterNumber: (value ?? '').toLowerCase() }),
      ]).pipe(map((data) => GetUniqueArray(data[0], data[1])))
    );
  }

  clearLocationSelection(NotificationForm: UntypedFormGroup) {
    NotificationForm.get('locationId')?.setValue(undefined);
    NotificationForm.get('location')?.setValue('');
    NotificationForm.get('location')?.enable();
  }

  onSelectionChange(option: string, NotificationForm: UntypedFormGroup) {
    NotificationForm.get('locationId')?.setValue(option);
    this.locationId = NotificationForm.get('locationId')?.value;
    NotificationForm.get('location')?.disable();
  }

  onSelectType() {
    this.userArray = [];
    this.noticeMsg = '';
    this.notificationType = (this.createNotificationForm.get('notificationType')?.value);
  }

  onSelectDuration(NotificationForm: UntypedFormGroup) {
    this.noticeMsg = '';
    this.duration = (NotificationForm.get('duration')?.value);
    if (this.duration) {
      const durationType = NotificationTypeDuration.get(parseInt(this.duration))?.toLowerCase() as string;
      this.noticeMsg = this.noticeMessage.get(durationType)['subTitle'];
    }

  }

  onTagRemove(tagToRemove: NbTagComponent): void {
    this.userArray = this.userArray.filter(t => t.name !== tagToRemove.text);
  }

  reformatPerson(person: UserDto) {
    return {
      name : person.firstName + ' ' + person.lastName,
      email : person.email,
      phone : person.phone,
      isActive: person.status === 'active'? true: false,
      recipientId: person.id,
      id: person.id,
      approved: true

    };
  };

  onSelectUser(option: UserDto, NotificationForm: UntypedFormGroup) {
    const user = option;

    if (this.userArray.length) {
      const checkUser = this.userArray.filter(t => t.name == `${user.firstName} ${user.lastName}`);
      if (!checkUser.length) {
        const formatedUser = this.reformatPerson(user)
        this.userArray.push(formatedUser)
      }
    } else {
      const formatedUser = this.reformatPerson(user)
      this.userArray.push(formatedUser)
    }
    NotificationForm.get('user')?.setValue('')
  }

  onSelectAssetType(NotificationForm: UntypedFormGroup) {
    this.assetType = (NotificationForm.get('assetType')?.value);
    NotificationForm.get('locationId')?.setValue(undefined);
    NotificationForm.get('location')?.setValue('');
    NotificationForm.get('location')?.enable();

  }

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  initCreateConsumptionForm() {
    this.createNotificationConsumption = this.formBuilder.group({
      assetType: ['', Validators.required],
      locationId: ['', Validators.required],
      location: ['', Validators.required],
      threshold: ['', Validators.required],
      date: [this.startDate, Validators.required],
      user: ['',],
      duration: ['', [Validators.required]],
    });
  }

  initCreateOutageForm() {
    this.createNotificationOutage = this.formBuilder.group({
      assetType: ['', Validators.required],
      locationId: ['', Validators.required],
      location: ['', Validators.required],
      user: ['',],
    });
  }

  initCreateReportForm() {
    this.createNotificationReport = this.formBuilder.group({
      assetType: [, Validators.required],
      locationId: ['', Validators.required],
      location: ['', Validators.required],
      duration: ['', Validators.required],
      date: [this.startDate, Validators.required],
      user: ['',],
    });
  }

  initCreateForm(): void {

    this.createNotificationForm = this.formBuilder.group({
      notificationType: ['', Validators.required],
    });
  }

  initUpdateForm() {
    if (this.NotificationFormUpdate?.canEdit) {
      switch (this.NotificationFormUpdate?.notificationType) {
        case 1:
          this.notificationType = 1;
          this.createNotificationForm = this.formBuilder.group({
            notificationType: [{ value: this.categoryData[0]?.id, disabled: false }],
          });

          this.assetType = this.NotificationFormUpdate.assetType;
          this.userArray = this.NotificationFormUpdate.recipients;
          this.createNotificationConsumption = this.formBuilder.group({
            assetType: [{ value: this.NotificationFormUpdate.assetType, disabled: false }, Validators.required],
            locationId: [this.NotificationFormUpdate?.assetId, Validators.required],
            location: [{ value: this.NotificationFormUpdate?.location, disabled: false }, Validators.required],
            threshold: [this.NotificationFormUpdate?.notificationIntervalData, Validators.required],
            date: [new Date(this.NotificationFormUpdate?.nextNotificationTime), Validators.required],
            user: ['',],
            duration: [this.NotificationFormUpdate?.recurrenceInterval, [Validators.required]],
          });
          break;
        case 2:
          this.notificationType = 2;
          this.createNotificationForm = this.formBuilder.group({
            notificationType: [{ value: this.categoryData[1]?.id, disabled: false }, Validators.required],
          });
          this.assetType = this.NotificationFormUpdate.assetType;
          this.userArray = this.NotificationFormUpdate.recipients;
          this.createNotificationOutage = this.formBuilder.group({
            assetType: [{ value: this.NotificationFormUpdate.assetType, disabled: false }, Validators.required],
            locationId: [this.NotificationFormUpdate?.assetId, Validators.required],
            location: [{ value: this.NotificationFormUpdate?.location, disabled: false }, Validators.required],
            user: ['',],
          });
          break;
        case 3:
          this.notificationType = 3;
          this.createNotificationForm = this.formBuilder.group({
            notificationType: [{ value: this.categoryData[2]?.id, disabled: false }, Validators.required],
          });
          this.assetType = this.NotificationFormUpdate.assetType;
          this.userArray = this.NotificationFormUpdate.recipients;
          this.createNotificationReport = this.formBuilder.group({
            duration: [this.NotificationFormUpdate?.recurrenceInterval, [Validators.required]],
            assetType: [{ value: this.NotificationFormUpdate.assetType, disabled: false }, Validators.required],
            locationId: [this.NotificationFormUpdate?.assetId, Validators.required],
            location: [{ value: this.NotificationFormUpdate?.location, disabled: true }, Validators.required],
            date: [new Date(this.NotificationFormUpdate?.nextNotificationTime), Validators.required],
            user: ['',],
          });
          break;
      }
    } else {
      this.toastr.danger(
        'You do not have permission to update Notification',
        'UNAUTHORISED',
        {
          position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
          preventDuplicates: true
        }
      );
      this.dialogRef.close();
    }


  }

  saveNotification() {
    switch (this.notificationType) {
      case 1:
        this.payload = {
          'notificationType': this.notificationType,
          'recurrenceInterval': this.duration,
          'nextNotificationTime': new DatePipe('en-EU').transform(this.createNotificationConsumption.get('date')?.value, 'MM/dd/YYYY hh:mm a') as string,
          'NotificationIntervalData': this.createNotificationConsumption.get('threshold')?.value,
          'recipients': this.userArray,
          'assetType': this.assetType,
          'assetId': this.locationId
        }
        break;
      case 2:
        this.payload = {
          'notificationType': this.notificationType,
          'recipients': this.userArray,
          'assetType': this.assetType,
          'assetId': this.locationId,
          'NotificationIntervalData': '0',
          'nextNotificationTime': new DatePipe('en-EU').transform(new Date, 'MM/dd/YYYY hh:mm a') as string
        }
        break;
      case 3:
        this.payload = {
          'notificationType': this.notificationType,
          'recurrenceInterval': this.duration,
          'nextNotificationTime': new DatePipe('en-EU').transform(this.createNotificationReport.get('date')?.value, 'MM/dd/YYYY hh:mm a') as string,
          'recipients': this.userArray,
          'assetType': this.assetType,
          'assetId': this.locationId,
          'NotificationIntervalData': '0'
        }

        break;
    }

    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.notificationService.postNotification(this.payload).subscribe(
      (result) => {
        this.submitted = false;
        if (result.status) {
          this.messages = ['Notification creation successful'];
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
          'An Error occured while Creating Notification',
        ];
      }
    );

  }


  updateNotification() {
     switch (this.notificationType) {
      case 1:
        this.updatePayload = {
          'notificationType': this.notificationType,
          'recurrenceInterval': this.createNotificationConsumption.get('duration')?.value,
          'nextNotificationTime': new DatePipe('en-EU').transform(this.createNotificationConsumption.get('date')?.value, 'MM/dd/YYYY hh:mm a') as string,
          'notificationIntervalData': this.createNotificationConsumption.get('threshold')?.value,
          'recipients': this.userArray,
          'assetType': this.createNotificationConsumption.get('assetType')?.value,
          'assetId': this.createNotificationConsumption.get('locationId')?.value,
        }
        break;
      case 2:
        this.updatePayload = {
          'notificationType': this.notificationType,
          'recipients': this.userArray,
          'assetType': this.createNotificationOutage.get('assetType')?.value,
          'assetId': this.createNotificationOutage.get('locationId')?.value,
          'nextNotificationTime': new DatePipe('en-EU').transform(new Date, 'MM/dd/YYYY hh:mm a') as string,
          'notificationIntervalData': '0'
        }
        break;
      case 3:
        this.updatePayload = {
          'notificationType': this.notificationType,
          'recurrenceInterval': this.duration,
          'nextNotificationTime': new DatePipe('en-EU').transform(this.createNotificationReport.get('date')?.value, 'MM/dd/YYYY hh:mm a') as string,
          'recipients': this.userArray,
          'assetType': this.createNotificationReport.get('assetType')?.value,
          'assetId': this.createNotificationReport.get('locationId')?.value,
          'notificationIntervalData': '0'
        }

        break;
    }

    this.errors = [];
    this.messages = [];
    this.submitted = true;
    this.notificationService.updateNotification(this.updatePayload, this.NotificationFormUpdate?.id).subscribe(
      (result) => {
        this.submitted = false;
        if (result.status) {
          this.messages = ['Notification update successful'];
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
          'An Error occured while Updating Notification.',
        ];
      }
    );
  }

  private callService(data?: any) {
    this.isLoadingData = true;
    switch (this.assetType) {
      case AssetTypeNotification.LOADPOINT:
        return this.loadpointService.getLoadPoints(data).pipe(map((d) => {
          const response = d.data?.itemList ?? [];
          this.options = GetUniqueArray(response, this.options);
          this.isLoadingData = false;
          return response
        }));
      case AssetTypeNotification.GEN_SET:
        return this.genSetService.getGeneratingSets(data).pipe(map((d) => {
          const response = d.data?.itemList ?? [];
          this.options = GetUniqueArray(response, this.options);
          this.isLoadingData = false;
          return response
        }));
      case AssetTypeNotification.POWER_SOURCE:
        return this.powerSourceService.getPowerSource(data).pipe(map((d) => {
          const response = d.data?.itemList ?? [];
          this.options = GetUniqueArray(response, this.options);
          this.isLoadingData = false;
          return response
        }));
      case AssetTypeNotification.UNKNOWN:
        return this.powerSourceService.getPowerSource(data).pipe(map((d) => {
          const response = d.data?.itemList ?? [];
          this.options = GetUniqueArray(response, this.options);
          this.isLoadingData = false;
          return response
        }));
    }
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }
}
