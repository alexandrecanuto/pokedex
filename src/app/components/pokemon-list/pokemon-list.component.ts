import { Component, OnInit, Input } from '@angular/core';
import { finalize } from 'rxjs/operators';
// Interfaces
import { Generation } from '../../interfaces/generation';
// Services
import { GenerationService } from '../../services/generation/generation.service';
import { PokemonService } from '../../services/pokemon/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  currentGen: Generation;
  pokemonId: string;
  genName: string;
  isLoading: boolean;

  constructor(private generationService: GenerationService, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.generationService.currentGenNameUpdated.subscribe(() => {
      this.genName = this.generationService.getCurrentGenName();
      this.getDetails();
    });
    this.pokemonService.currentPokemonIdUpdated.subscribe(() => {
      this.pokemonId = this.pokemonService.getCurrentPokemonId();
    });
  }

  /**
   * Fetches details of one generation from the service.
   */
  getDetails(): void {
    this.currentGen = this.generationService.getGeneration(this.genName);

    if (!this.currentGen) {
      this.isLoading = true;
      this.generationService.fetchGeneration(this.genName)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(gen => this.currentGen = gen);
    }
  }

}
