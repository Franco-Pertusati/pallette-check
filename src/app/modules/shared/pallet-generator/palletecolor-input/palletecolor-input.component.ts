import { Component, model } from '@angular/core';
import { ColorData } from '../../../../core/interfaces/colorData';
import { DialogComponent } from "../../prt-ui/dialog/dialog.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { PalletService } from '../../../../core/services/pallet.service';

@Component({
  selector: 'app-palletecolor-input',
  imports: [DialogComponent, ButtonComponent],
  templateUrl: './palletecolor-input.component.html'
})
export class PalletecolorInputComponent {
  color = model.required<ColorData>();
  isDialogOpen: boolean = false
}
