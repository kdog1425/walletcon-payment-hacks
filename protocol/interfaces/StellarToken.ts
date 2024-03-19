/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Blockchain } from './Blockchain';
export type StellarToken = {
    type: StellarToken.type;
    blockchain: Blockchain;
    issuerAddress: string;
    stellarCurrencyCode: string;
};
export namespace StellarToken {
    export enum type {
        STELLAR_TOKEN = 'StellarToken',
    }
}

