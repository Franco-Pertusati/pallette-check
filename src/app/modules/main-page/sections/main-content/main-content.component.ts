import { Component } from '@angular/core';
import { PalletteDataComponent } from "./components/pallette-data/pallette-data.component";
import { ColorShadesComponent } from "./components/color-shades/color-shades.component";
import { ComponentsShowcaseComponent } from "./components/components-showcase/components-showcase.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-main-content',
  imports: [PalletteDataComponent, ColorShadesComponent, ComponentsShowcaseComponent, FooterComponent],
  templateUrl: './main-content.component.html'
})
export class MainContentComponent {

}
