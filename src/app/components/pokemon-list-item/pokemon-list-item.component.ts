import { Component, OnInit, Input } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
// Services
import { SidenavService } from '../../services/sidenav/sidenav.service';

@Component({
  selector: 'app-pokemon-list-item',
  templateUrl: './pokemon-list-item.component.html',
  styleUrls: ['./pokemon-list-item.component.scss']
})
export class PokemonListItemComponent implements OnInit {
  @Input()
  isCurrent: boolean;
  @Input()
  pokemon: any;

  constructor(private media: MediaObserver, private sidenavService: SidenavService) { }

  ngOnInit(): void {
  }

  onClick(): void {
    if (!this.media.isActive('gt-md'))
      this.sidenavService.close();
  }
}
