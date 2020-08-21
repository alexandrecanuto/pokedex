import { Component, OnInit, Input } from '@angular/core';
// Interfaces
import { Species } from '../../interfaces/species';

@Component({
  selector: 'app-evolution',
  templateUrl: './evolution.component.html',
  styleUrls: ['./evolution.component.scss']
})
export class EvolutionComponent implements OnInit {
  @Input()
  evolution: Species;

  constructor() { }

  ngOnInit(): void {
  }

}
