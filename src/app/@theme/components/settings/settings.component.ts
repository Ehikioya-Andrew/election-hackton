import { Component } from '@angular/core';
import { NbDialogRef, NbThemeService } from '@nebular/theme';
import { isMobile } from 'mobile-device-detect';
import { AuthService } from 'src/app/@core/data-services/auth.service';
import { LocalStorageKey } from 'src/app/@core/enums/local-storage-key.enum';
import { RoleMap } from 'src/app/@core/maps/role.map';
import { UserModel } from 'src/app/@core/models/user.model';
import { SecureLocalStorageService } from 'src/app/@core/utils/secure-local-storage.service';
import { AuthResources, AuthResourcesNavMap } from 'src/app/pages/auth/auth-resources';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  user: UserModel;
  roleMap = RoleMap;

  isDarkTheme: boolean;
  isMobile = isMobile;

  changePasswordUrl = AuthResourcesNavMap.get(AuthResources.UpdatePasswordView)?.route;

  constructor(
    private userAuthService: AuthService,
    public dialogRef: NbDialogRef<SettingsComponent>,
    private themeService: NbThemeService,
    private storageService: SecureLocalStorageService) {
    this.user = this.userAuthService.getAuthenticatedUser() as UserModel
    this.isDarkTheme = (
      this.storageService.get<string>(LocalStorageKey.THEME.toString()) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default')
    ) === 'dark';

  }

  close() {
    this.dialogRef.close();
  }


  onThemeChange(isDarkSelected: boolean): void {
    this.isDarkTheme = isDarkSelected;
    const theme = isDarkSelected ? 'dark' : 'default';
    this.themeService.changeTheme(theme);
    this.storageService.set<string>(LocalStorageKey.THEME.toString(), theme);
  }

}
