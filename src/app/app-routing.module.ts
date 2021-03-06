import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule), canActivate: [AuthGuard]},
  { path: 'maps', loadChildren: () => import('./pages/maps/maps.module').then( m => m.MapsPageModule), canActivate: [AuthGuard]},
  { path: 'products', loadChildren: () => import('./pages/products/products.module').then( m => m.ProductsPageModule), canActivate: [AuthGuard]},
  { path: 'orders', loadChildren: () => import('./pages/orders/orders.module').then( m => m.OrdersPageModule), canActivate: [AuthGuard] },
  { path: 'historial', loadChildren: () => import('./pages/historial/historial.module').then( m => m.HistorialPageModule), canActivate: [AuthGuard] },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
