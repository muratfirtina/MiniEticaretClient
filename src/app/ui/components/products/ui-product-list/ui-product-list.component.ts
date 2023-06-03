import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseUrl } from 'src/app/contracts/base_url';
import { List_Product } from 'src/app/contracts/list_product';
import { List_Product_Image } from 'src/app/contracts/list_product_image';
import { FileService } from 'src/app/services/common/models/file.service';
import { ProductService } from 'src/app/services/common/models/product.service';

@Component({
  selector: 'app-ui-product-list',
  templateUrl: './ui-product-list.component.html',
  styleUrls: ['./ui-product-list.component.scss'],
})
export class UiProductListComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService
  ) {}

  currentPageNo: number;
  totalProductCount: number;
  totalPageCount: number;
  pageSize: number = 5;
  pageList: number[] = [];
  baseUrl: BaseUrl;

  products: List_Product[];

   async ngOnInit() {

    this.baseUrl = await this.fileService.getBaseStorageUrl();
    

    this.activatedRoute.params.subscribe(async (params) => {
      this.currentPageNo = parseInt(params['pageNo'] ?? 1);

      const data: { totalProductCount: number; products: List_Product[] } =
        await this.productService.list(
          this.currentPageNo - 1,
          this.pageSize,
          () => {},
          (errorMessage) => {}
        );
      this.products = data.products;

      this.products = this.products.map<List_Product>(p => {
        const listProduct : List_Product = {
          id : p.id,
          name : p.name,
          stock : p.stock,
          price : p.price,
          createdDate : p.createdDate,
          updatedDate : p.updatedDate,
          imagePath: p.productImageFiles && p.productImageFiles.length
          ? p.productImageFiles.map((image) => image.path).join()
          : "",
          productImageFiles: p.productImageFiles || []
    

        };
        return listProduct;
      })


      this.totalProductCount = data.totalProductCount;
      this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);

      this.pageList = [];
      if (this.totalPageCount >= 7) {
        if (this.currentPageNo - 3 <= 0) {
          for (let i = 1; i <= 7; i++) {
            this.pageList.push(i);
          }
        } else if (this.currentPageNo + 3 > this.totalPageCount) {
          for (let i = this.totalPageCount - 6; i <= this.totalPageCount; i++) {
            this.pageList.push(i);
          }
        } else {
          for (
            let i = this.currentPageNo - 3;
            i <= this.currentPageNo + 3;
            i++
          ) {
            this.pageList.push(i);
          }
        }
      } else {
        for (let i = 1; i <= this.totalPageCount; i++) {
          this.pageList.push(i);
        }
      }
    });
  }
}