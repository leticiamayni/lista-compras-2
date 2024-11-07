import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { loginGuard } from './guards/login.guard';
import { authGuardFn } from '@auth0/auth0-angular';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: "home", component: HomeComponent, canActivate: [authGuardFn]},
    {path: "**", component: PageNotFoundComponent}
];