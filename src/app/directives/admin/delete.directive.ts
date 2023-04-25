import { HttpErrorResponse } from '@angular/common/http';
import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { SpinnerType } from 'src/app/base/base.component';
import {
  DeleteDialogComponent,
  DeleteState,
} from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { HttpClientService } from 'src/app/services/common/http-client.service';


declare var $: any;

@Directive({
  selector: '[appDelete]',
})
export class DeleteDirective {
  constructor(
    private element: ElementRef,
    private _renderer: Renderer2,
    private httpClientService: HttpClientService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private alertifyService: AlertifyService
  ) { 
    
    const button = this._renderer.createElement('button');
    button.innerHTML =
      '<span class="text">Sil</span><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span>';
    this._renderer.addClass(button, 'noselect');
    this._renderer.setStyle(button, 'width', '40px');
    this._renderer.setStyle(button, 'height', '25px');
    this._renderer.setStyle(button, 'cursor', 'pointer');
    this._renderer.setStyle(button, 'display', 'flex');
    this._renderer.setStyle(button, 'align-items', 'center');
    this._renderer.setStyle(button, 'background', 'red');
    this._renderer.setStyle(button, 'border', 'none');
    this._renderer.setStyle(button, 'border-radius', '5px');
    this._renderer.setStyle(
      button,
      'box-shadow',
      '1px 1px 3px rgba(0,0,0,0.15)'
    );
    this._renderer.setStyle(button, 'background', '#e62222');

    this._renderer.appendChild(this.element.nativeElement, button);

    this._renderer.addClass(button, 'my-custom-button');

    const buttonStyle = document.createElement('style');
    buttonStyle.type = 'text/css';
    buttonStyle.innerHTML = `
    .my-custom-button,
    .my-custom-button span {
    transition: 200ms;
    }

    .my-custom-button .text {
    transform: translateX(0px);
    color: white;
    font-weight: bold;
    }

   .my-custom-button .icon {
    position: absolute;
    transform: translateX(10px);
    height: 24px;
    width: 25px;
    display: flex;
    align-items: right;
    justify-content: center;
    margin-left: 3px;
   }

    .my-custom-button svg {
    width: 10px;
    fill: #eee;
    }

   .my-custom-button:hover {
    background: #ff3636;
    }

   .my-custom-button:hover .text {
    color: transparent;
    }

    .my-custom-button:hover .icon {
    width: 15px;
    border-left: none;
    transform: translateX(5px);
   }

   .my-custom-button:focus {
    outline: none;
   }

    .my-custom-button:active .icon svg {
    transform: scale(0.8);
    }`;

    this._renderer.appendChild(this.element.nativeElement, buttonStyle);

    /* const img =  _renderer.createElement('img');
      img.setAttribute('src', '../../../../../assets/icons/delete.png');
      img.setAttribute('style', 'width: 25px; height: 25px; cursor: pointer;');
      _renderer.appendChild(element.nativeElement, img); */
  }

  @Input() id: string;
  @Input() controller: string;
  @Output() refresh: EventEmitter<any> = new EventEmitter();

  @HostListener('click')
  async onClick() {
    this.openDialog(async () => {
      this.spinner.show(SpinnerType.BallSpinClockwise);
      const td: HTMLTableCellElement = this.element.nativeElement;
      
      try {
        await firstValueFrom( this.httpClientService.delete({ controller: this.controller }, this.id));
        
        $(td.parentElement).fadeOut('animated fadeOut', () => {
          this.refresh.emit();
          this.alertifyService.message('Silindi', {
            dismissOthers: true,
            messageType: MessageType.Success,
            position: Position.TopRight
          });
        });
      } catch (error) {
        this.spinner.hide(SpinnerType.BallSpinClockwise);
        this.alertifyService.message('Silinemedi', {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight
        });
      }; 
    });
  }
  

  openDialog(afterYes: any): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: DeleteState.Yes,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == DeleteState.Yes) afterYes();
    });
  }
}
