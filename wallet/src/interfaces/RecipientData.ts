/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { PaymentOption } from './PaymentOption';
/**
 * Includes the details of the merchant to be displayed to the payer
 */
export type RecipientData = {
    paymentOptions?: Array<PaymentOption>;
    /**
     * Recipient's display name. Should be recognizable by the payer
     */
    name: string;
    /**
     * The legal entity name
     */
    legalName?: string;
    /**
     * URL of the logo/avatar of the recipient
     */
    imageUrl?: string;
    /**
     * URL of the recipient's website
     */
    websiteUrl?: string;
    address?: Address;
};

