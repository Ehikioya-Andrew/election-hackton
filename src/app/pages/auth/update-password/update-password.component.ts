import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, getDeepFromObject } from '@nebular/auth';
import { ResponseDto } from 'src/app/@core/dtos/response-dto';
import { AuthService } from 'src/app/@core/data-services/auth.service';
import { SeoService } from 'src/app/@core/utils';


@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {


  redirectDelay = 0;
  showMessages: any = {};
  strategy = '';

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  pass: any = {};

  isPasswordHidden = true;

  constructor(
    protected service: AuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private seo: SeoService
  ) {
    this.redirectDelay = this.getConfigValue('forms.resetPassword.redirectDelay');
    this.showMessages = this.getConfigValue('forms.resetPassword.showMessages');
    this.strategy = this.getConfigValue('forms.resetPassword.strategy');
  }

  ngOnInit() {
    this.seo.setSeoData('Update Password', 'Update application password');
  }

  updatePass(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.service.updatePassword(this.pass).subscribe(
      (result) => {
        this.submitted = false;
        if (result.status) {
          this.messages = ['Your password was changed successfully'];
          setTimeout(() => {
            return this.router.navigateByUrl('/');
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
          'An Error occured while changing your password'
        ];
      }
    );
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

}
