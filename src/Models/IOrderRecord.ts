import { Product } from "../data/product.types";

interface IOrderRecord {
    OrderProduct: Product
    OrderCount: number
    OrderAdditionalDetails: string
}