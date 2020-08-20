import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
// Interfaces:
import { APIResults } from '../../interfaces/api-results';
import { Generation } from '../../interfaces/generation';

@Injectable({
  providedIn: 'root'
})
export class GenerationService {
  currentGenUpdated: EventEmitter<Generation> = new EventEmitter();

  // Current generation variable.
  private currentGen: Generation;
  // Generation details storage object.
  private details = {};
  // Generations storage object.
  private generations: Generation[] = [];
  // The base string for fetching generations.
  private url = 'https://pokeapi.co/api/v2/generation';

  constructor(private http: HttpClient) { }

  /**
   * Fetch generations from the API.
   * Resolves each item and then return.
   * @return {Observable<Generation[]>}
   */
  fetchGenerations(): Observable<Generation[]> {
    return this.http.get<APIResults>(this.url).pipe(
      map(res => {
        this.generations = res.results.map(this.resolveGeneration);
        return this.generations;
      }),
    );
  }

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
   * Getter for 'currentGen'.
   * @return {Generation}
   */
  getCurrentGen(): Generation {
    return this.currentGen;
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
      details.pokemon_species = details.pokemon_species.map(species => {
        if (!species.id) {
          const parts = species.url.split('/');
          species.id = parseInt(parts[parts.length - 2]);
        }
        return species;
      }).sort((a, b) => a.id - b.id);
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
   * Setter for 'currentGen'.
   */
  setCurrentGen(name: string) {
    this.currentGen = this.details[name];
    this.currentGenUpdated.emit();
  }
}
