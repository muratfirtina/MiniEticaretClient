import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
import { AuthService } from './services/common/auth.service';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ComponentName, DynamicLoadComponentService } from './services/common/dynamic-load-component.service';
import { DynamicLoadComponentDirective } from './directives/common/dynamic-load-component.directive';
import { List_Cart_Item } from './contracts/cart/list_cart_item';
import { CartService } from './services/common/models/cart.service';
import { Observable } from 'rxjs';

declare var $: any;
declare var bootstrap: any;


$(document).ready(function() {
  $('.menuItems-Wul').hover(
    function() {
      var menuWidth = 1200;
      var menuHeight = 56;
      var containerWidth = $('.containerFullWidth').outerWidth();
      var containerHeight = $('.containerFullWidth').outerHeight();
      var menuLeft = (containerWidth - menuWidth) / 2;
      var menuTop = 150;

      $(this).find('.menuItems-Lui').css({
        'visibility': 'visible',
        'width': '1200px',
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
export class AppComponent implements OnInit{

  /* @ViewChild('popoverButton') popoverButton: ElementRef; */

  @ViewChild(DynamicLoadComponentDirective, { static: true })
  dynamicLoadComponentDirective: DynamicLoadComponentDirective;

  cartItems: List_Cart_Item[];
  cartItemsObservable: Observable<List_Cart_Item[]>; // Observable'ı tanımla

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
      name: 'Oto, Bahçe, Yapı Market',
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
  
  activeCategoryIndex: number | null = null;
  isMouseInsideCategory: boolean = false;

  toggleCategory(index: number) {
    this.activeCategoryIndex = this.activeCategoryIndex === index ? null : index

  }
  mouseleaveCategory() {
    
  }



  constructor(
    public authService: AuthService,
    private toastrService: CustomToastrService,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private dynamicLoadComponentService: DynamicLoadComponentService,
    private cartService: CartService,
    ) {
    authService.identityCheck();
    this.cartItemsObservable = cartService.getCartItemsObservable();
  }
  async ngOnInit() {
    if (this.authService.isAuthenticated) {
      await this.getCartItems();
      this.loadComponent();
    }
    this.cartItemsObservable.subscribe(cartItems => {
      this.cartItems = cartItems; // Yeni sepet öğelerini güncelle
    });
  }
  
  async getCartItems() {
    this.cartItems = await this.cartService.get();
  }
  

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
  
}

