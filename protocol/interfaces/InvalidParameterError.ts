/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Error } from './Error';
export type InvalidParameterError = (Error & {
    /**
     * Invalid or missing parameter(s)
     */
    code?: InvalidParameterError.code;
});
export namespace InvalidParameterError {
    /**
     * Invalid or missing parameter(s)
     */
    export enum code {
        '_1' = 1,
    }
}

