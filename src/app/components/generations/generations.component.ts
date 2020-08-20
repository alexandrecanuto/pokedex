import { Component, OnInit } from '@angular/core';
import { GenerationService } from '../../services/generation/generation.service';
import { Generation } from '../../interfaces/generation';

@Component({
  selector: 'app-generations',
  templateUrl: './generations.component.html',
  styleUrls: ['./generations.component.scss']
})
export class GenerationsComponent implements OnInit {
  generations: Generation[];
  selectedGen: Generation;
  details: Generation;

  constructor(private generationService: GenerationService) { }

  ngOnInit() {
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

  /**
   * Fetches details of one generation from the service.
   */
  getDetails(): void {
    this.details = this.generationService.getGeneration(this.selectedGen.name);

    if (this.details) {
      this.generationService.setCurrentGen(this.selectedGen.name);
    } else {
      this.generationService.fetchGeneration(this.selectedGen.name)
      .subscribe(details => {
        this.details = details;
        this.generationService.setCurrentGen(this.selectedGen.name);
      });
    }
  }

  onGenChange(): void {
    console.log('this.selectedGen:', this.selectedGen);
    if (!this.selectedGen)
      return;

    this.getDetails();
  }

}
