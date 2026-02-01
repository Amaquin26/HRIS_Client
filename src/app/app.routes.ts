import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { EntraUsersPage } from './pages/entra-users/entra-users-page';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        component: Home
    },
    {
        path: "entra-users",
        component: EntraUsersPage
    }
];
