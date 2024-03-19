/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Blockchain } from './Blockchain';
export type Erc20Token = {
    type: Erc20Token.type;
    blockchain: Blockchain;
    contractAddress: string;
};
export namespace Erc20Token {
    export enum type {
        ERC20TOKEN = 'Erc20Token',
    }
}

