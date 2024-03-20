/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Bep20Token } from './Bep20Token';
import type { Erc20Token } from './Erc20Token';
import type { StellarToken } from './StellarToken';
export type TokenAsset = (Erc20Token | Bep20Token | StellarToken | {
    testAsset?: boolean;
});

