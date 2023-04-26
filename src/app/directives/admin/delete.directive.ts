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
    
    const button = this._renderer.createElement('button__text');
    button.innerHTML =
      '<span class="button_delete__text">Delete</span><span class="button_delete__icon"><svg class="svg" xmlns="http://www.w3.org/2000/svg" width="512" viewBox="0 0 512 512" height="512" class="svg"><path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path><line style="stroke:#fff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px" x1="80" x2="432" y1="112" y2="112"></line><path d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path><line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="256" x2="256" y1="176" y2="400"></line><line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="184" x2="192" y1="176" y2="400"></line><line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="328" x2="320" y1="176" y2="400"></line></svg></span>';
    this._renderer.appendChild(this.element.nativeElement, button);

    this._renderer.addClass(button, 'button_delete');

    const buttonStyle = document.createElement('style');
    buttonStyle.innerHTML = `
    .button_delete {
      position: relative;
      width: 45px;
      height: 25px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #cc0000;
      background-color: #ff2d2d;
    }
    
    .button_delete, .button_delete__icon, .button_delete__text {
      transition: all 0.3s;
    }
    
    .button_delete .button_delete__text {
      position: relative;
      transform: translateX(0);
      color: #fff;
      font-weight: 500;
    }
    
    .button_delete .button_delete__icon {
      position: absolute;
      transform: translateX(124px);
      height: 100%;
      width: 45px;
      background-color: #cc0000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .button_delete .svg {
      width: 20px;
      stroke: #fff;
    }
    
    .button_delete:hover {
      background: #cc0000;
    }
    
    .button_delete:hover .button_delete__text {
      color: transparent;
    }
    
    .button_delete:hover .button_delete__icon {
      width: 25px;
      transform: translateX(0);
    }
    
    .button_delete:active .button_delete__icon {
      background-color: #b20000;
    }
    
    .button_delete:active {
      border: 1px solid #b20000;
    }

    `;

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