import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
// Interfaces
import { Evolution } from '../../interfaces/evolution';
import { Pokemon } from '../../interfaces/pokemon';
import { Species } from '../../interfaces/species';
// Services
import { GenerationService } from '../../services/generation/generation.service';
import { PokemonService } from '../../services/pokemon/pokemon.service';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent implements OnInit {
  evolutions: Species[];
  isLoadingEvolutions: boolean;
  isLoadingPokemon: boolean;
  isLoadingSpecies: boolean;
  pokemon: Pokemon;
  pokemonId: string;
  species: Species;

  constructor(private route: ActivatedRoute, private generationService: GenerationService, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.pokemonId = paramMap.get('id');
      this.pokemonService.setCurrentPokemonId(this.pokemonId);
      this.getPokemon();
      this.getSpecies();
    });
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
   * Fetches details of one Pokémon species from the service.
   */
  getSpecies(): void {
    this.species = this.pokemonService.getSpecies(this.pokemonId);

    if (!this.species) {
      this.isLoadingSpecies = true;
      this.pokemonService.fetchSpecies(this.pokemonId)
      .pipe(finalize(() => this.isLoadingSpecies = false))
      .subscribe(species => {
        this.species = species;
        this.getEvolutions();
        this.generationService.setCurrentGenName(this.species.generation.name);
      });
    } else {
      this.getEvolutions();
      this.generationService.setCurrentGenName(this.species.generation.name);
    }
  }

  /**
   * Fetches evolution details of one Pokémon species from the service.
   */
  getEvolutions(): void {
    this.evolutions = this.pokemonService.getEvolutions(this.pokemonId);
    console.log('this.evolutions:', this.evolutions);

    if (!this.evolutions) {
      this.isLoadingEvolutions = true;
      this.pokemonService.fetchEvolutions(this.pokemonId, this.species.evolution_chain.url)
      .pipe(finalize(() => this.isLoadingEvolutions = false))
      .subscribe(evolutions => {
        this.evolutions = evolutions;
        console.log('this.evolutions:', this.evolutions);
      });
    }
  }

}
