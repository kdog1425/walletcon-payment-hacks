/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PaymentItem = {
    /**
     * A unique identifier for the payment item.
     */
    id?: string;
    /**
     * (Optional) A URL to an image of the item.
     */
    image?: string | null;
    /**
     * A human-readable description of the item.
     */
    description?: string;
    /**
     * The number of units of the item.
     */
    quantity?: number;
    /**
     * The price of a single unit of the item, before tax.
     */
    unit_price?: number;
    /**
     * The total price of the item, including tax (if applicable).
     */
    total_price?: number;
    /**
     * (Optional) The amount of tax applied to the item.
     */
    tax?: number | null;
    /**
     * (Optional) The tax rate applied to the item, as a percentage.
     */
    tax_rate?: number | null;
};
