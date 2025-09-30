import { Component, inject } from '@angular/core';
import { ColorInputComponent } from "./components/color-input/color-input.component";
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { FormsModule } from '@angular/forms'
import { colorGenerationService } from '../../../../core/services/app/color-generation.service';

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  colorGenerationService = inject(colorGenerationService)
}
