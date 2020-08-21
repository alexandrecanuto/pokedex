import { Generation } from './generation';

export interface Species {
  id: number;
  displayName: string;
  evolution_chain: any;
  name: string;
  url: string;
  flavor_text_entries: any[];
  dex_entry: string;
  generation: Generation;
  varieties: any[];
  forms: any[];
}
