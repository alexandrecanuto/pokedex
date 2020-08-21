import { Generation } from './generation';

export interface Species {
  id: number;
  name: string;
  url: string;
  flavor_text_entries: any[];
  dex_entry: string;
  generation: Generation;
}
