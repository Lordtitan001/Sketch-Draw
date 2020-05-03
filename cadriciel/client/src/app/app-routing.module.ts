import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { MainComponent } from './components/main/main.component';
import { UserManualComponent } from './components/user-manual/user-manual.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: MainComponent
    },
    {
        path: 'dashboard',
        component: EntryPointComponent
    },
    {
        path: 'manual',
        component: UserManualComponent
    },
    {
        path: 'gallery',
        component: GalleryComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot((routes))
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
