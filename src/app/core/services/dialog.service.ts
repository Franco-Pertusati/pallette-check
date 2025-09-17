import { Injectable, signal, Type } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  isDialogOpen = signal<boolean>(false);

  componentToShow = signal<Type<any> | null>(null);

  dialogData = signal<any>(null);

  openDialog<T>(component: Type<T>, data?: any) {
    this.componentToShow.set(component);
    this.dialogData.set(data ?? null);
    this.isDialogOpen.set(true);
  }

  closeDialog() {
    this.isDialogOpen.set(false);
    this.componentToShow.set(null);
    this.dialogData.set(null);
  }
}
