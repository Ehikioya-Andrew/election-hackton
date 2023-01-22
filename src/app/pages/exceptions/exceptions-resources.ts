import { ResourceNavModel } from "src/app/@core/models/resource-nav.model";

export enum ExceptionResources {
    UnauthorisedView = 'error:unauthorised-view',
    PageNotFoundView = 'error:page-not-found-view',
    UserIdleView = 'error:user-idle-view',
}

export const ExceptionResourcesNavMap = new Map<ExceptionResources, ResourceNavModel>([
    [
        ExceptionResources.UnauthorisedView,
        {
            route: '/error/unauthorised',
            path: 'unauthorised'
        }
    ],
    [
        ExceptionResources.PageNotFoundView,
        {
            route: '/error/page-not-found',
            path: 'page-not-found'
        }
    ],
    [
        ExceptionResources.UserIdleView,
        {
            route: '/error/user-idle',
            path: 'user-idle'
        }
    ],
])
