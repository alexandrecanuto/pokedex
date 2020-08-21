import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { EmptyComponent } from './components/empty/empty.component';
import { PokemonComponent } from './components/pokemon/pokemon.component';

const routes: Routes = [
  // { path: '', component: EmptyComponent, pathMatch: 'full' },
  { path: 'pokemon/:id', component: PokemonComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
