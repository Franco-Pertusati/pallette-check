import { Component } from '@angular/core';
import { ButtonComponent } from "../ui/button/button.component";
import { CardComponent } from "../exampleComponents/card/card.component";

@Component({
  selector: 'app-components-showcase',
  imports: [CardComponent, ButtonComponent],
  templateUrl: './components-showcase.component.html'
})
export class ComponentsShowcaseComponent {

}
