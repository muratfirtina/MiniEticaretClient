import { List_Cart_Item } from "../cart/list_cart_item";

export class SingleOrder {
    id: string;
    orderCode: string;
    address: string;
    cartItems: any[];
    createdDate: Date;
    description: string;
    completed: boolean;


}