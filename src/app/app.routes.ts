import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { EntraUsers } from './pages/entra-users/entra-users';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        component: Home
    },
    {
        path: "entra-users",
        component: EntraUsers
    }
];
