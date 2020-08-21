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
  // Pokémon evolutions storage object.
  private evolutions = {};
  // Pokémon details storage object.
  private details = {};
  // Pokémon species storage object.
  private species = {};
  // The base string for fetching pokémon.
  private url = 'https://pokeapi.co/api/v2/pokemon';
  private speciesUrl = 'https://pokeapi.co/api/v2/pokemon-species';

  constructor(private http: HttpClient) { }

  /**
   * Fetch a pokémon's evolution chain from the API.
   * @return {Observable<Species[]>}
   */
  fetchEvolutions(id: string, url: string): Observable<Species[]> {
    return this.http.get<Species[]>(url).
      pipe(
        map((evolutionsData: any) => {
          const data = this.resolveEvolutionData(evolutionsData);
          data.forEach((species: Species) => {
            this.evolutions[species.id] = data;
          });
          return data;
        })
      );
  }

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
   * Getter for a pokémon's evolutions.
   * @return {Species[]}
   */
  getEvolutions(id: string): Species[] {
    if (!id?.length)
      return;

    return this.evolutions[id];
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

    // Display name:
    if (details?.name) {
      const exceptions = [29, 32, 782, 439, 474, 782, 783, 784, 785, 786, 787, 788];
      if (details.id === 772) {
        details.displayName = 'Type: Null';
      } else if (!exceptions.includes(details.id)) {
        details.displayName = details.name.split('-')[0];
      }
    }

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
   * Resolve evolution data into an species array.
   * @return {Species[]}
   */
  resolveEvolutionData(data: any): Species[] {
    let chain = data.chain,
        evos = [];

    this.resolveEvolutions(chain, evos);
    evos = evos.map(this.resolveSpecies);

    return evos;
  }

  /**
   * Recursevely resolve an evolution chain into the array of species.
   */
  resolveEvolutions(chain: any, evos: Species[]) {
    evos.push(chain.species);

    if (chain.evolves_to?.length) {
      for (let i = 0; i < chain.evolves_to.length; i++) {
        this.resolveEvolutions(chain.evolves_to[i], evos);
      }
    }
  }

  /**
   * Resolve a pokemon species object before displaying (display name, i.e.).
   * @param  {Species} species
   * @return {Species}
   */
  resolveSpecies(species?: Species): Species {

    // ID:
    if (!species.id) {
      const parts = species.url.split('/');
      species.id = parseInt(parts[parts.length - 2]);
    }

    // Display name:
    if (species?.name && !species.displayName) {
      const exceptions = [29, 32, 782, 439, 474, 782, 783, 784, 785, 786, 787, 788];
      if (species.id === 772) {
        species.displayName = 'Type: Null';
      } else if (!exceptions.includes(species.id)) {
        species.displayName = species.name.split('-')[0];
      }
    }

    // Dex entry:
    if (species?.flavor_text_entries?.length && !species.dex_entry) {
      // Filter only English entries:
      species.flavor_text_entries = species.flavor_text_entries.filter(entry => entry?.language?.name === 'en');
      // Get the newest entry:
      species.dex_entry = species.flavor_text_entries[species.flavor_text_entries.length - 1].flavor_text;
    }

    // Varieties:
    // if (species?.varieties?.length && !species.forms) {
    //   species.forms = species.varieties.map(variety => {
    //     console.log('variety:', variety);
    //     variety.pokemon = this.resolveSpecies(variety.pokemon);
    //   });
    // }

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
