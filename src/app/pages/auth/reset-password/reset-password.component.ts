import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getDeepFromObject, NB_AUTH_OPTIONS } from '@nebular/auth';
import { ResetPasswordDto } from 'src/app/@core/dtos/reset-password.dto';
import { ResponseDto } from 'src/app/@core/dtos/response-dto';
import { AuthService } from 'src/app/@core/data-services/auth.service';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {

  redirectDelay = 0;
  showMessages: any = {};
  strategy = '';
  isPasswordHidden = true;

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  isNewPassword: boolean;

  constructor(
    protected service: AuthService,
    private cd: ChangeDetectorRef,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.redirectDelay = this.getConfigValue('forms.resetPassword.redirectDelay');
    this.showMessages = this.getConfigValue('forms.resetPassword.showMessages');
    this.strategy = this.getConfigValue('forms.resetPassword.strategy');
    this.isNewPassword = route.snapshot.data.isNewPassword;
  }


  resetPass(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    const resetPasswordDto: ResetPasswordDto = {
      newPassword: this.user.password,
      token: this.route.snapshot.queryParams.token,
      tokenId: this.route.snapshot.queryParams.tokenId
    };

    of(this.isNewPassword)
      .pipe(
        switchMap((isNewPassword) => {
          return isNewPassword ? this.service.newPassword(resetPasswordDto) : this.service.resetPassword(resetPasswordDto)
        })
      ).subscribe(
        (result) => {
          this.submitted = false;
          if (result.status) {
            this.messages = [`Your password was ${this.isNewPassword ? 'set' : 'changed'} successfully`];
            setTimeout(() => {
              return this.router.navigateByUrl('/auth/login');
            }, this.redirectDelay);
            this.cd.detectChanges();
          } else {
            this.errors = [
              result.message as string
            ];
          }
        },
        (error: ResponseDto<string>) => {
          this.submitted = false;
          this.errors = [
            `An Error occured while ${this.isNewPassword ? 'setting' : 'changing'} your password`,
          ];
        }
      );
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
