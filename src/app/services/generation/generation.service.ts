import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
// Interfaces:
import { APIResults } from '../../interfaces/api-results';
import { Generation } from '../../interfaces/generation';
// Services:
import { PokemonService } from '../pokemon/pokemon.service';

@Injectable({
  providedIn: 'root'
})
export class GenerationService {
  currentGenNameUpdated: EventEmitter<Generation> = new EventEmitter();

  // Current generation name variable.
  private currentGenName: string;
  // Generation details storage object.
  private details = {};
  // Generations storage object.
  private generations: Generation[] = [];
  // The base string for fetching generations.
  private url = 'https://pokeapi.co/api/v2/generation';

  constructor(private http: HttpClient, private pokemonService: PokemonService) { }

  /**
   * Fetch a generation's details from the API.
   * @return {Observable<Generation>}
   */
  fetchGeneration(name: string): Observable<Generation> {
    const url = `${this.url}/${name}`;
    return this.http.get<Generation>(url).
      pipe(
        tap(details => this.details[name] = this.resolveDetails(details))
      );
  }

  /**
   * Fetch generations from the API.
   * Resolves each item and then return.
   * @return {Observable<Generation[]>}
   */
  fetchGenerations(): Observable<Generation[]> {
    return this.http.get<APIResults>(this.url).pipe(
      map(res => {
        this.generations = res.results.map(this.resolveGeneration);
        // this.setCurrentGenName('generation-i');
        return this.generations;
      }),
    );
  }

  /**
   * Getter for 'currentGenName'.
   * @return {string}
   */
  getCurrentGenName(): string {
    return this.currentGenName;
  }

  /**
   * Getter for a single generation.
   * @return {Generation}
   */
  getGeneration(name: string): Generation {
    if (!name?.length)
      return;

    return this.details[name];
  }

  getGenByName(name: string): Generation {
    if (!name?.length)
      return;

    return this.generations.filter(gen => gen.name === name)[0];
  }

  /**
   * Getter for 'generations'.
   * @return {Generation[]}
   */
  getGenerations(): Generation[] {
    return this.generations;
  }

  /**
   * Resolve a generation details object before displaying (display name, i.e.).
   * @param  {Generation} details
   * @return {Generation}
   */
  resolveDetails(details?: Generation): Generation {

    if (details?.pokemon_species) {
      details.pokemon_species = details.pokemon_species.map(this.pokemonService.resolveSpecies).sort((a, b) => a.id - b.id);
    }

    return details;
  }

  /**
   * Resolve a generation object before displaying (display name, i.e.).
   * @param  {Generation} generation
   * @return {Generation}
   */
  resolveGeneration(generation?: Generation): Generation {
    if (generation?.name) {
      let parts = generation.name.split('-');
      parts[0] = parts[0]?.charAt(0).toUpperCase() + parts[0]?.substring(1);
      parts[1] = parts[1]?.toUpperCase();
      generation.displayName = parts.join(' ');
    }

    return generation;
  }

  /**
   * Setter for 'currentGenName'.
   */
  setCurrentGenName(name: string) {
    this.currentGenName = name;
    this.currentGenNameUpdated.emit();
  }
}
