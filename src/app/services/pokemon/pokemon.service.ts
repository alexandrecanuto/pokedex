import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
// Interfaces:
import { APIResults } from '../../interfaces/api-results';
import { Pokemon } from '../../interfaces/pokemon';
import { Species } from '../../interfaces/species';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  currentPokemonIdUpdated: EventEmitter<Pokemon> = new EventEmitter();

  // Current pokémon ID variable.
  private currentPokemonId: string;
  // Pokémon details storage object.
  private details = {};
  // Pokémon species storage object.
  private species = {};
  // The base string for fetching pokémon.
  private url = 'https://pokeapi.co/api/v2/pokemon';
  private speciesUrl = 'https://pokeapi.co/api/v2/pokemon-species';

  constructor(private http: HttpClient) { }

  /**
   * Fetch a pokémon's details from the API.
   * @return {Observable<Pokemon>}
   */
  fetchPokemon(id: string): Observable<Pokemon> {
    const url = `${this.url}/${id}`;
    return this.http.get<Pokemon>(url).
      pipe(
        tap(details => this.details[id] = this.resolveDetails(details))
      );
  }

  /**
   * Fetch a pokémon's species details from the API.
   * @return {Observable<Species>}
   */
  fetchSpecies(id: string): Observable<Species> {
    const url = `${this.speciesUrl}/${id}`;
    return this.http.get<Species>(url).
      pipe(
        tap(species => this.species[id] = this.resolveSpecies(species))
      );
  }

  /**
   * Getter for 'currentPokemonId'.
   * @return {string}
   */
  getCurrentPokemonId(): string {
    return this.currentPokemonId;
  }

  /**
   * Getter for a single pokémon.
   * @return {Pokemon}
   */
  getPokemon(id: string): Pokemon {
    if (!id?.length)
      return;

    return this.details[id];
  }

  /**
   * Getter for a single species.
   * @return {Species}
   */
  getSpecies(id: string): Species {
    if (!id?.length)
      return;

    return this.species[id];
  }

  /**
   * Resolve a pokemon details object before displaying (display name, i.e.).
   * @param  {Pokemon} details
   * @return {Pokemon}
   */
  resolveDetails(details?: Pokemon): Pokemon {

    // Types:
    if (details?.types[0]?.slot) {
      details.types = details.types.map(slot => slot.type);
    }

    // Sprite:
    if (details?.sprites && !details.sprites.main) {
      const other = details.sprites.other;

      if (other && other['official-artwork'] && other['official-artwork'].front_default) {
        details.sprites.main = other['official-artwork'].front_default;
      } else {
        details.sprites.main = details.sprites.front_default;
      }
    }

    return details;
  }

  /**
   * Resolve a pokemon species object before displaying (display name, i.e.).
   * @param  {Species} species
   * @return {Species}
   */
  resolveSpecies(species?: Species): Species {

    // Dex entry:
    if (species?.flavor_text_entries?.length && !species.dex_entry) {
      // Filter only English entries:
      species.flavor_text_entries = species.flavor_text_entries.filter(entry => entry?.language?.name === 'en');
      // Get the newest entry:
      species.dex_entry = species.flavor_text_entries[species.flavor_text_entries.length - 1].flavor_text;
    }

    return species;
  }

  /**
   * Setter for 'currentPokemonId'.
   */
  setCurrentPokemonId(name: string) {
    this.currentPokemonId = name;
    this.currentPokemonIdUpdated.emit();
  }
}
