import { Product } from "../data/product.types";

export default interface IOrderRecord {
    OrderRecordId?: string
    OrderProduct: Product
    OrderCount: number
    OrderSize: number
    OrderAdditionalDetails: string
}