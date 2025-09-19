import { Component } from '@angular/core';
import { ComitCalendarComponent } from "./example-components/comit-calendar/comit-calendar.component";
import { ClotheItemComponent } from "./example-components/clothe-item/clothe-item.component";
import { ExampleFeaturesComponent } from "./example-components/example-features/example-features.component";
import { ExampleInboxComponent } from "./example-components/example-inbox/example-inbox.component";
import { ProjectStepComponent } from "./example-components/project-step/project-step.component";
import { EvCardComponent } from "./example-components/ev-card/ev-card.component";

@Component({
  selector: 'app-components-showcase',
  imports: [ComitCalendarComponent, ClotheItemComponent, ExampleFeaturesComponent, ExampleInboxComponent, ProjectStepComponent, EvCardComponent],
  templateUrl: './components-showcase.component.html'
})
export class ComponentsShowcaseComponent {

}
