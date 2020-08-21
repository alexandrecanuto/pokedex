import { Component, OnInit } from '@angular/core';
// Interfaces
import { Generation } from '../../interfaces/generation';
// Services
import { GenerationService } from '../../services/generation/generation.service';

@Component({
  selector: 'app-generations',
  templateUrl: './generations.component.html',
  styleUrls: ['./generations.component.scss']
})
export class GenerationsComponent implements OnInit {
  generations: Generation[];
  selectedGen: Generation;

  constructor(private generationService: GenerationService) { }

  ngOnInit() {
    this.generationService.currentGenNameUpdated.subscribe(() => {
      let genName = this.generationService.getCurrentGenName();
      this.selectedGen = this.generationService.getGenByName(genName);
    });
    this.getGenerations();
  }

  /**
   * Fetches all generations from the service.
   */
  getGenerations(): void {
    this.generations = this.generationService.getGenerations();

    if (!this.generations?.length) {
      this.generationService.fetchGenerations()
      .subscribe(gens => this.generations = gens);
    }
  }

  onGenChange(): void {
    if (!this.selectedGen)
      return;
    console.log('onGenChange');

    this.generationService.setCurrentGenName(this.selectedGen.name);
  }

}
