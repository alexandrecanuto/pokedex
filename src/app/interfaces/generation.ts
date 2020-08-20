import { Species } from './species';

export interface Generation {
  displayName: string;
  name: string;
  url:  string;
  pokemon_species: Species[];
}
