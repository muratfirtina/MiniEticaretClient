import { Component, ViewChild } from '@angular/core';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
import { AuthService } from './services/common/auth.service';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ComponentName, DynamicLoadComponentService } from './services/common/dynamic-load-component.service';
import { DynamicLoadComponentDirective } from './directives/common/dynamic-load-component.directive';

declare var $: any;
declare var bootstrap: any;


$(document).ready(function() {
  $('.menuItems-Wul').hover(
    function() {
      var menuWidth = 1300;
      var menuHeight = 56;
      var containerWidth = $('.containerFullWidth').outerWidth();
      var containerHeight = $('.containerFullWidth').outerHeight();
      var menuLeft = (containerWidth - menuWidth) / 2;
      var menuTop = 145;

      $(this).find('.menuItems-Lui').css({
        'visibility': 'visible',
        'width': '1300px',
        'left': menuLeft,
        'top': menuTop,
      });
    },
    function() {
      $(this).find('.menuItems-Lui').css('visibility', 'hidden');
    }
  );
});

/* $(document).ready(function() {
  $('.menuItems-Wul').hover(
    function() {
      $('.overlay').addClass('show');
    },
    function() {
      $('.overlay').removeClass('show');
    }
  );
}); */


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  /* @ViewChild('popoverButton') popoverButton: ElementRef; */

  @ViewChild(DynamicLoadComponentDirective, { static: true })
  dynamicLoadComponentDirective: DynamicLoadComponentDirective;

  isDropdownOverlayActive: boolean = false;
  categories = [
    {
      name: 'Elektronik',
      subcategories: [
        {
          name: 'Bilgisayar',
          subcategories: [
            {
              name: 'Laptop',
              subcategories: [
                {
                  name: 'Oyun Laptopu',
                },
              ]  
            },
            {
              name: 'Masaüstü'
            }
            // İhtiyaç duyulan düzeye kadar alt kategorileri buraya ekleyebilirsiniz
          ]
        },
        {
          name: 'Cep Telefonu'
        }
        // İhtiyaç duyulan düzeye kadar alt kategorileri buraya ekleyebilirsiniz
      ]
    },
    {
      name: 'Moda',
      subcategories: [
        {
          name: 'Erkek Giyim',
          subcategories: [
            {
              name: 'Gömlek'
            },
          ]
        },
      ]
    },
    {
      name: 'Anne, Bebek, Oyuncak',
      subcategories: [
        {
          name: 'Biberon ',
          subcategories: [
            {
              name: 'Cam Biberon'
            },
          ]
        },
      ]
    },
    {
      name: 'Spor & Outdoor',
      subcategories: [
        {
          name: 'Erkek Giyim',
          subcategories: [
            {
              name: 'Tenis'
            },
          ]
        },
      ]
    },
    {
      name: 'Ev, Yaşam, Kırtasiye, Ofis',
      subcategories: [
        {
          name: 'Dolap',
          subcategories: [
            {
              name: 'Ayakkabı dolabı'
            },
          ]
        },
      ]
    },
    {
      name: 'Kozmetik & Kişisel Bakım',
      subcategories: [
        {
          name: 'Erkek Parfüm',
          subcategories: [
            {
              name: 'Deodorant'
            },
          ]
        },
      ]
    },
    {
      name: 'Kitap, Müzik, Film, Hobi',
      subcategories: [
        {
          name: 'Film',
          subcategories: [
            {
              name: 'Bilim Kurgu'
            },
          ]
        },
      ]
    },
    {
      name: 'Oto, Bahçe, Yapı Marke',
      subcategories: [
        {
          name: 'Araba',
          subcategories: [
            {
              name: 'Araç Kokusu'
            },
          ]
        },
      ]
    },
    {
      name: 'Süpermarket & Petshop',
      subcategories: [
        {
          name: 'Kedi',
          subcategories: [
            {
              name: 'Kısır Kedi Maması'
            },
          ]
        },
      ]
    },
  ];


  constructor(
    public authService: AuthService,
    private toastrService: CustomToastrService,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private dynamicLoadComponentService: DynamicLoadComponentService,) {
    authService.identityCheck();
  }


  /* ngAfterViewInit(): void {
    this.initializePopover(); // Call initializePopover after view initialization
  } */
  

  signOut() {
    localStorage.removeItem("accessToken");
    //localStorage.removeItem("refreshToken");
    this.authService.identityCheck();
    this.router.navigateByUrl("").then(() => {
      location.reload();
    }); // Ana sayfaya yönlendir;
    this.toastrService.message("Logged out successfully","Log Out ",{
      toastrMessageType: ToastrMessageType.Warning,
      position: ToastrPosition.TopRight
    })
  }
  loadComponent() {
    this.dynamicLoadComponentService.loadComponent(ComponentName.CartComponent, this.dynamicLoadComponentDirective.viewContainerRef);

  }

  toggleDropdownOverlay() {
    this.isDropdownOverlayActive = !this.isDropdownOverlayActive;
  }
  
  

  openDropdown() {
    this.isDropdownOverlayActive = true;
  }

  closeDropdown() {
    this.isDropdownOverlayActive = false;
  }
  

  /* initializePopover(): void {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map((popoverTriggerEl: any) => {
      return new bootstrap.Popover(popoverTriggerEl); // Initialize popover
    });
  } */

}

