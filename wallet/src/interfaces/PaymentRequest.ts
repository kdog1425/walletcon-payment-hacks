/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeeItem } from './FeeItem';
import type { PaymentItem } from './PaymentItem';
export type PaymentRequest = {
    /**
     * An array of items to be paid for.
     */
    items?: Array<PaymentItem>;
    /**
     * The total price of all items before tax.
     */
    subtotal?: number;
    /**
     * The total amount of tax applied to all items.
     */
    totalTax?: number | null;
    fees?: Array<FeeItem>;
    /**
     * The total amount to be paid, including items, tax, fees, and delivery.
     */
    totalAmount: number;
};

