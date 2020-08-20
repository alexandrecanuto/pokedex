import { Component, OnInit } from '@angular/core';
import { GenerationService } from '../../services/generation/generation.service';
import { Generation } from '../../interfaces/generation';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  selectedGen: Generation;

  constructor(private generationService: GenerationService) { }

  ngOnInit(): void {
    this.generationService.currentGenUpdated.subscribe(() => {
      this.selectedGen = this.generationService.getCurrentGen();
    });
  }

}
