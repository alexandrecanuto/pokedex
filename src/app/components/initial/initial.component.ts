import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MediaObserver } from '@angular/flex-layout';
// Interfaces
import { Pokemon } from '../../interfaces/pokemon';
import { Species } from '../../interfaces/species';
// Services
import { PokemonService } from '../../services/pokemon/pokemon.service';
import { SidenavService } from '../../services/sidenav/sidenav.service';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss']
})
export class InitialComponent implements OnInit {
  isLoadingPokemon: boolean;
  isLoadingSpecies: boolean;
  pokemonId: string;
  pokemon: Pokemon;
  species: Species;

  constructor(
    public media: MediaObserver,
    private pokemonService: PokemonService,
    private sidenavService: SidenavService
  ) { }

  ngOnInit(): void {
    this.pokemonId = this.getRandomId();
    this.pokemonService.setCurrentPokemonId(this.pokemonId);
    this.getPokemon();
  }

  /**
   * Fetches details of one Pokémon from the service.
   */
  getPokemon(): void {
    this.pokemon = this.pokemonService.getPokemon(this.pokemonId);

    if (!this.pokemon) {
      this.isLoadingPokemon = true;
      this.pokemonService.fetchPokemon(this.pokemonId)
      .pipe(finalize(() => this.isLoadingPokemon = false))
      .subscribe(pokemon => this.pokemon = pokemon);
    }
  }

  /**
   * Returns a random Pokémon ID.
   */
  getRandomId() {
    const min = 1,
          max = 721,
          id = Math.floor(Math.random() * (max - min + 1)) + min;

    return id.toString();
  }

  /**
   * Opens the sidenav.
   */
  openDrawer() {
    this.sidenavService.open();
  }

}
