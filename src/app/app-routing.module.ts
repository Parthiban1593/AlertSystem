import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:"location",
    loadChildren: () =>
    import('./features/location/location.module').then((m) => m.LocationModule)
  },
  {
    path:"",
    pathMatch:"full",
    redirectTo:"location"
  },
  {
    path:"*",
    pathMatch:"full",
    redirectTo:"location"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
