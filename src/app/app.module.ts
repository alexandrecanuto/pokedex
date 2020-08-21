import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

// Material:
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

// Components:
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { InitialComponent } from './components/initial/initial.component';
import { GenerationsComponent } from './components/generations/generations.component';
import { PokemonComponent } from './components/pokemon/pokemon.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonListItemComponent } from './components/pokemon-list-item/pokemon-list-item.component';
import { PokemonTypeComponent } from './components/pokemon-type/pokemon-type.component';

// Pipes
import { HeightPipe } from './pipes/height/height.pipe';
import { WeightPipe } from './pipes/weight/weight.pipe';
import { ImagePreloadDirective } from './directives/image-preload.directive';
import { PokemonHeaderComponent } from './components/pokemon-header/pokemon-header.component';

@NgModule({
  declarations: [
    // Components
    AppComponent,
    GenerationsComponent,
    PokemonListComponent,
    PokemonListItemComponent,
    PokemonComponent,
    InitialComponent,
    PokemonTypeComponent,

    // Pipes
    HeightPipe,
    WeightPipe,
    ImagePreloadDirective,
    PokemonHeaderComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
