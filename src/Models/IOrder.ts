import IOrderRecord from "./IOrderRecord";

export interface IOrder {
    OrderRecords: IOrderRecord
    OrderTotal: number

    OrderAddress: string
    OrderRecipient: string
    OrderEmail: string
    OrderPhone: string
    
    OrderPaymentMethod: string
    // Admin
    OrderStatus: string
}