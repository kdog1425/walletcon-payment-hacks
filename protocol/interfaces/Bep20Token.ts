/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Blockchain } from './Blockchain';
export type Bep20Token = {
    type: Bep20Token.type;
    blockchain: Blockchain;
    contractAddress: string;
};
export namespace Bep20Token {
    export enum type {
        BEP20TOKEN = 'Bep20Token',
    }
}

