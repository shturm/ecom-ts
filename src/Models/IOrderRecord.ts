import { Product } from "../data/product.types";

export default interface IOrderRecord {
    OrderProduct: Product
    OrderCount: number
    OrderSize: number
    OrderAdditionalDetails: string
}