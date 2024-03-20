# Open Payment Protocol

## Introduction
This is an open spec to describe a new payment protocol utilizing wallet connect, which is a protocol for connecting dApps to mobile wallets using end-to-end encryption. 
This protocol is designed to be used by merchants, PSPs (Payment Service Providers) or acquirers to request payments from their customers, and by the customers to approve these payments.
This is the first version of the protocol, and it is expected to evolve over time, to include more advanced features and capabilities.

## Protocol Overview

### High Level Payment Flow

*In the following flow, we use the term **"merchant"** to refer to the entity requesting the payment, and the term **"customer"** to refer to the entity making the payment.*

*The **merchant** might be served by a **PSP**, an **acquirer** or directly implement the protocol, but for the sake of simplicity we will use the term **"merchant"** for all of those*.

1. On the merchant's website, the customer selects the items they want to purchase and goes to the checkout page
2. The merchant's website generates a payment request QR/deeplink and present it to the customer, to be scanned or clicked by their (mobile) wallet
3. The customer's wallet parse the link data (using SIWE/EIP-5573 format) and use that to fetch the payment request details from the merchant's server
4. The wallet presents the payment request details to the customer, and the customer approves the payment
5. The wallet sends the payment approval to the merchant's server with a signed permit later to be used for the payment
6. The merchant's server verifies the permit and the payment approval, and then invoke a dedicated smart contract to execute the payment
7. The smart contract verifies the payment permit, and then invoke a transfer of the payment amount from the customer's wallet to the merchant's wallet
8. After receiving the payment, the merchant's server generate a receipt, encrypt it using the customer's wallet public key, and upload it to an IPFS node
9. The merchant's server sends the IPFS link to the customer's wallet, and the wallet fetches the receipt and presents it to the customer
10. From now on, if the customer switches to another wallet with the same private key, it can scan the IPFS, fetch all historical receipts and present them to the customer
11. The customer can also use the receipt to prove the payment to the merchant, or to any other party

### Payment Request Fallback Flow

In case the customer's wallet does not support the payment request format, the wallet would see the QR/deeplink as a legacy WalletConnect connection request.
The merchant website would then show a dApp to orchestrate the payment process, showing the customer the payment request details and asking for their approval on their wallet.
The wallet then just shows a regular typed message signing request, which is the permit to be signed.
After approving the permit, the wallet sends the signed permit back to the dApp, which in turn submit it to the merchant's server and the rest of the flow is the same as the regular flow.

### Session already established fallback flow

In case the customer's wallet already has an established session with the merchant's server, 
the wallet would use a new rpc call to the merchant's server to get the payment request metadata (with the same SIWE/EIP-5573 format) and run through the rest of the flow.
The wallet might choose to disconnect the previous session and establish a new one, making it look like the new flow above.

### Merchant's Server considerations

We encourage the merchant's server to lock the payment request metadata of a payment id after permit was received, and not to allow any further fetches of the metadata.
This would prevent the customer from fetching the payment request metadata again and again, and also prevent scraping of the payment request metadata by malicious actors.

## Data Structures

### Payment Request Metadata
Following the [EIP-5573](https://eips.ethereum.org/EIPS/eip-5573) format, and the [UCAN spec](https://github.com/ucan-wg/spec) of defining capabilities, the payment request metadata is a JSON object with the following fields:
```json
{
  "att": {
    "<merchant's server>": {
      "crud/read": [{
        "matching": "<payment unique id>"
      }],
      "crud/update": [{
        "matching": "<payment unique id>"
      }]
    }
  },
  "prf": ["<proof>"]
}
```

### Payment Permit

TODO: Define the permit format
