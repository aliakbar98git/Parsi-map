export interface IAddToCart {
  ProductId: string;
  Quantity: number;
}

export interface IUpdateCart {
  ForceMaximumOrderQuantity: boolean;
  List: IAddToCart[];
}
