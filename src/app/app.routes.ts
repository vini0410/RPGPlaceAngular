import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { MyAccount } from './pages/my-account/my-account';
import { authGuard } from './guards/auth-guard';
import { GameComponent } from './pages/game/game';
import { LandingComponent } from './pages/landing/landing';
import { NewCharacterComponent } from './pages/new-character/new-character';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'my-account', component: MyAccount, canActivate: [authGuard] },
  { path: 'game/:id', component: GameComponent, canActivate: [authGuard] },
  { path: 'new-character', component: NewCharacterComponent, canActivate: [authGuard] },
];
