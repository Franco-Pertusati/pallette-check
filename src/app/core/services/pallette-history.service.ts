import { Injectable } from '@angular/core';
import { PalletteData } from '../interfaces/colorData';
import { PalletteService } from './pallette.service'

@Injectable({
  providedIn: 'root'
})
export class PalletteHistoryService {
  palletteHistory: PalletteData[] = []

  constructor(private palletteService: PalletteService) { }

  savePallete(newPallette: PalletteData) {
    this.palletteHistory.push(newPallette)
  }
}
