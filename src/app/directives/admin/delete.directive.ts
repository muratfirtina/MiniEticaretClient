import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { DeleteDialogComponent, DeleteState } from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import { ProductService } from 'src/app/services/common/models/product.service';

declare var $: any;

@Directive({
  selector: '[appDelete]'
})
export class DeleteDirective {

  constructor(
    private element:ElementRef,
    private _renderer: Renderer2,
    private productService: ProductService,
    private snipper: NgxSpinnerService,
    public dialog: MatDialog
    ) {
      const img =  _renderer.createElement('img');
      img.setAttribute('src', '../../../../../assets/icons/delete.png');
      img.setAttribute('style', 'width: 25px; height: 25px; cursor: pointer;');
      _renderer.appendChild(element.nativeElement, img);
     }
     
     @Input() id: string;
     @Output() refresh: EventEmitter<any> = new EventEmitter();

     @HostListener('click')
     async onClick(){
      this.openDialog(async () => {
        this.snipper.show(SpinnerType.BallSpinClockwise);
        const td: HTMLTableCellElement = this.element.nativeElement;
        await this.productService.delete(this.id);
        $(td.parentElement).fadeOut('animated fadeOut', () => {this.refresh.emit()});
      });
      
      
     }

     openDialog(afterYes : any): void {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        data: DeleteState.Yes,
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result == DeleteState.Yes) 
          afterYes();
      });
    }

}


