import { ResourceNavModel } from "src/app/@core/models/resource-nav.model";

export enum AuthResources {
    LoginView = 'auth:login-view',
    RequestPasswordView = 'auth:request-password-view',
    ResetPasswordView = 'auth:reset-password-view',
    NewPasswordView = 'auth:new-password-view',
    UpdatePasswordView = 'auth:update-password-view',
}

export const AuthResourcesNavMap = new Map<AuthResources, ResourceNavModel>([
    [
        AuthResources.LoginView,
        {
            route: `/auth/login`,
            path: 'login'
        }
    ],
    [
        AuthResources.RequestPasswordView,
        {
            route: '/auth/request-password',
            path: 'request-password'
        }
    ],
    [
        AuthResources.ResetPasswordView,
        {
            route: '/auth/reset-password',
            path: 'reset-password'
        }
    ],
    [
        AuthResources.NewPasswordView,
        {
            route: '/auth/new-user',
            path: 'new-user'
        }
    ],
    [
        AuthResources.UpdatePasswordView,
        {
            route: '/auth/update-password',
            path: 'update-password'
        }
    ],
])
