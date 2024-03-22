/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FeeItem = {
    /**
     * (Optional) Any additional fees associated with the payment.
     */
    fee?: number | null;
    /**
     * (Optional) The cost of delivery.
     */
    feeType?: FeeItem.feeType | null;
    /**
     * (Optional) Type of fees that were applied to the payment.
     */
    feeDescription?: string | null;
};
export namespace FeeItem {
    /**
     * (Optional) The cost of delivery.
     */
    export enum feeType {
        DELIVERY = 'delivery',
        PACKAGING = 'packaging',
        IMPORT = 'import',
        OTHER = 'other',
    }
}

