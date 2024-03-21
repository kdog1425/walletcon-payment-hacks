import base64url from "base64url";

const RECAP_URI_PREFIX = "urn:recap:";

export type AttAbilityQualifications = Array<Record<string, any>>;
export type AttAbilities = Record<string, AttAbilityQualifications>;

export interface ReCap {
  att?: Record<string, AttAbilities>;
  prf? : Array<string>;
}

export enum PaymentActions {
  CHARGE = "payment/charge",
}

export function makePaymentReCap(paymentDetailsUrl: string): ReCap {
  const NoLimitations: AttAbilityQualifications = [{}];
  return {
    att: {
      [paymentDetailsUrl]: {
        [PaymentActions.CHARGE]: NoLimitations
      }
    }
  };
}

export function makePaymentReCapUri(paymentDetailsUrl: string): string {
  return makeReCapUri(makePaymentReCap(paymentDetailsUrl));
}

export function getPaymentUrls(reCapDetails: ReCap): string[] {
  const urls: string[] = [];
  if (reCapDetails.att) {
    for (const [url, abilities] of Object.entries(reCapDetails.att)) {
      for (const ability of Object.keys(abilities)) {
        if (ability.startsWith(PaymentActions.CHARGE)) {
          urls.push(url);
        }
      }
    }
  }
  return urls;
}

export function makeReCapUri(reCapDetails: ReCap): string {
  const json = JSON.stringify(reCapDetails);
  return RECAP_URI_PREFIX + base64url.encode(json);
}

export function decodeReCapUri(reCapUri: string): ReCap {
  if (!reCapUri.startsWith(RECAP_URI_PREFIX)) {
    throw new Error('Bad ReCap URI');
  }
  const json = base64url.decode(reCapUri.substring(RECAP_URI_PREFIX.length));
  return JSON.parse(json);
}

export function isRecapUri(uri: string): boolean {
  return uri.startsWith(RECAP_URI_PREFIX);
}