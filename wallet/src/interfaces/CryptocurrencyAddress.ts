/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NativeCryptocurrency } from './NativeCryptocurrency';
import type { TokenAsset } from './TokenAsset';
export type CryptocurrencyAddress = {
    cryptocurrency: (NativeCryptocurrency | TokenAsset);
    address: string;
    tag?: string;
};

