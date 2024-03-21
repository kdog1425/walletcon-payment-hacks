/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Blockchain } from './Blockchain';
export type SolanaToken = {
    type: SolanaToken.type;
    blockchain: Blockchain;
    mintAuthority?: string;
    freezeAuthority?: string;
};
export namespace SolanaToken {
    export enum type {
        SOLANA_TOKEN = 'SolanaToken',
    }
}

