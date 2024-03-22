/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentId } from './PaymentId';
import type { PaymentRequest } from './PaymentRequest';
import type { RecipientData } from './RecipientData';
export type PaymentDetails = {
    paymentId: PaymentId;
    recipient?: RecipientData;
    paymentRequest: PaymentRequest;
    /**
     * Description of the payment. To be displayed to the customer
     */
    description?: string;
};

