export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}
export interface Params {
  id: string;
}
export interface ReqResHandler {
  request?: any;
  response: any;
  params?: Params;
}
export interface ReqBody {
  type: string;
  value: Product;
}
