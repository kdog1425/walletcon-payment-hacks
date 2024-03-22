import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useSnapshot } from 'valtio'
import {
  Col,
  Divider,
  Row,
  Text,
  Code,
  Checkbox,
  Grid,
  Card,
  Collapse,
  Textarea,
  Spacer,
  Radio
} from '@nextui-org/react'
import { buildAuthObject, getSdkError, populateAuthPayload } from '@walletconnect/utils'

import ModalFooter from '@/components/ModalFooter'
import ProjectInfoCard from '@/components/ProjectInfoCard'
import RequestModalContainer from '@/components/RequestModalContainer'
import VerifyInfobox from '@/components/VerifyInfobox'
import ModalStore from '@/store/ModalStore'
import SettingsStore from '@/store/SettingsStore'
import { eip155Addresses, eip155Wallets } from '@/utils/EIP155WalletUtil'
import { web3wallet } from '@/utils/WalletConnectUtil'
import RequestModal from './RequestModal'
import { EIP155_CHAINS, EIP155_SIGNING_METHODS } from '@/data/EIP155Data'
import { styledToast } from '@/utils/HelperUtil'

import {
  CryptocurrencySymbol,
  PaymentDetails,
  PaymentItem,
  type PaymentOption,
  Cryptocurrency,
  NativeCryptocurrency,
  type Erc20Token,
  type Bep20Token
} from '@/interfaces'
import { decodeReCapUri, isRecapUri, getPaymentUrls } from '@/utils/recap'
import { approveEIP155Request, getWallet } from '@/utils/EIP155RequestHandlerUtil'
import { ethers } from 'ethers'

const RECEPIENT = {
  name: 'amazon.com',
  legalName: 'Amazon.com, Inc.',
  websiteUrl: 'https://www.amazon.com',
  imageUrl: 'https://www.amazon.com/favicon.ico'
}

const PRODUCTS: PaymentItem[] = [
  {
    id: 'product1',
    description: 'WalletConnect T-Shirt',
    image:
      'https://media.licdn.com/dms/image/D5603AQHUlpdAWNJUrA/profile-displayphoto-shrink_800_800/0/1680013647317?e=2147483647&v=beta&t=phUpAvLD8WkyLu1tLGmi1iODFzFr-3yDnZx4txrLZNQ',
    unit_price: 20.5
  },
  {
    id: 'product2',
    description: 'Pasteis de Nata (3 units)',
    image: 'https://live.staticflickr.com/2575/4075178544_c28b05c36d_b.jpg',
    unit_price: 9.99
  },
  {
    id: 'product3',
    description: '🔥WiFi Powder - Instant Internet',
    unit_price: 37.9
  }
]

function round(decimalPlaces: number, value: number): number {
  const factor = Math.pow(10, decimalPlaces)
  return Math.round(value * factor) / factor
}

const PAYMENTS: PaymentDetails[] = PRODUCTS.map(product => {
  return {
    paymentId: product.id ?? 'productNoID?!',
    recipient: {
      ...RECEPIENT,
      paymentOptions: [
        {
          amount: {
            amount: round(6, product.unit_price! * 0.00029),
            currency: { cryptocurrencySymbol: CryptocurrencySymbol.ETH }
          },
          payToAddress: {
            cryptocurrency: { cryptocurrencySymbol: CryptocurrencySymbol.ETH },
            address: '0x0b0f4A6236ff74e52D2874BBED09A39603F422C8'
          }
        }
      ]
    },
    paymentRequest: {
      totalAmount: product.unit_price!,
      items: [
        {
          ...product,
          total_price: product.unit_price,
          quantity: 1
        }
      ]
    }
  }
})

async function getPaymentRequestDetails(paymentDetailsUrl: string): Promise<PaymentDetails> {
  const paymentId = paymentDetailsUrl.split('/').pop()
  return PAYMENTS.find(payment => payment.paymentId === paymentId) ?? PAYMENTS[0]
}

interface AuthenticationMessageProps {
  messages: string[]
  waitForPayment: boolean
  payment?: PaymentDetails
}

function ItemCard({ item }: { item: PaymentItem }) {
  return (
    <Card bordered={true}>
      <Row gap={1}>{item.description}</Row>
      <Row gap={1} justify="flex-end">
        <Text color="gray" small={true}>
          {item.quantity} × ${item.unit_price} =
        </Text>
        <Text small={true}> ${item.total_price}</Text>
      </Row>
      <Card.Image
        width="100%"
        height={140}
        alt={item.description ?? 'Product'}
        src={item.image ?? '/assets/no-image.svg'}
        objectFit="cover"
      />
    </Card>
  )
}

function CryptocurrencyId({ currency }: { currency?: Cryptocurrency }) {
  if (!currency) {
    return <Text span={true}>Unknown Currency</Text>
  }
  if (currency.hasOwnProperty('cryptocurrencySymbol')) {
    return <Text span={true}>{(currency as NativeCryptocurrency).cryptocurrencySymbol}</Text>
  }
  if (currency.hasOwnProperty('contractAddress')) {
    const token = currency as Erc20Token | Bep20Token
    return (
      <Text span={true}>
        {token.blockchain} token {token.contractAddress}
      </Text>
    )
  }
  return <Text span={true}>Some Currency</Text>
}

function shorten(s: string, maxLen: number): string {
  if (s.length <= maxLen) {
    return s
  }

  const segmentLen = Math.floor((maxLen - 1) / 2)
  return s.slice(0, segmentLen) + '⋯' + s.slice(-segmentLen)
}

function PaymentOptions({ paymentOptions }: { paymentOptions: Array<PaymentOption> }) {
  return (
    <Radio.Group size="sm">
      <Radio.Desc>Payment options</Radio.Desc>
      {paymentOptions.map((paymentOption, index) => {
        return (
          <Radio value={index} key={index} squared={true} checked={index == 0}>
            {paymentOption.amount.amount}
            <Spacer x={0.3} />
            <CryptocurrencyId currency={paymentOption.amount.currency} />
            <Spacer x={0.5} />
            <Text color="gray" span={true}>
              To:
            </Text>
            <Spacer x={0.3} />
            <Text small={true} span={true}>
              {shorten(paymentOption.payToAddress.address, 20)}
            </Text>
          </Radio>
        )
      })}
    </Radio.Group>
  )
}

function AuthenticationMessage({ messages, waitForPayment, payment }: AuthenticationMessageProps) {
  if (waitForPayment) {
    if (!payment) {
      return (
        <Row>
          <Col>
            <Text h5>Waiting for payment...</Text>
          </Col>
        </Row>
      )
    }

    const items = payment.paymentRequest.items
    if (!items) {
      throw Error('Payment request without items')
    }

    return (
      <Fragment>
        {items.map((item, i) => {
          return <ItemCard key={i} item={item} />
        })}
        <Row gap={1} justify="flex-end">
          <Col span={4}>
            <Text>Total: ${payment.paymentRequest.totalAmount}</Text>
          </Col>
        </Row>
        <PaymentOptions paymentOptions={payment.recipient?.paymentOptions ?? []} />
        <Col>
          <Collapse.Group>
            <Collapse
              title="Show payment request statement"
              css={{ '& h3': { fontSize: '1em', fontWeight: '$light' } }}
            >
              {messages.map((message, index) => {
                console.log('@loop messageToSign', message)
                return <Textarea key={index} width="100%" readOnly={true} initialValue={message} />
              })}
            </Collapse>
          </Collapse.Group>
        </Col>
      </Fragment>
    )
  }

  return (
    <Row>
      <Col>
        <Text h5>Messages to Sign ({messages.length})</Text>
        {messages.map((message, index) => {
          console.log('@loop messageToSign', message)
          return (
            <Code key={index}>
              <Text color="$gray400">{message}</Text>
            </Code>
          )
        })}
      </Col>
    </Row>
  )
}

export default function SessionAuthenticateModal() {
  // Get request and wallet data from store
  const authRequest = ModalStore.state.data?.authRequest

  const { account } = useSnapshot(SettingsStore.state)
  const [messages, setMessages] = useState<
    { authPayload: any; message: string; id: number; iss: string }[]
  >([])
  const [supportedChains] = useState<string[]>(Object.keys(EIP155_CHAINS))
  const [supportedMethods] = useState<string[]>(Object.values(EIP155_SIGNING_METHODS))
  const [signStrategy, setSignStrategy] = useState(1)
  // Ensure request and wallet are defined

  const [waitForPayment, setWaitForPayment] = useState<boolean>(false)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | undefined>()

  const address = eip155Addresses[account]

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const getMessageToSign = useCallback(
    (authPayload, iss) => {
      const message = web3wallet.engine.signClient.formatAuthMessage({
        request: authPayload,
        iss
      })
      console.log('message', message)
      return message
    },
    [address]
  )

  useEffect(() => {
    if (!authRequest?.params?.authPayload) return
    console.log('authRequest', authRequest)
    console.log('supportedChains', supportedChains)
    const newAuthPayload = populateAuthPayload({
      authPayload: authRequest?.params?.authPayload,
      chains: supportedChains,
      methods: supportedMethods
    })

    const recaps = newAuthPayload.resources?.filter(isRecapUri).map(decodeReCapUri) || []
    const paymentUrls = recaps.map(getPaymentUrls).flat()

    // Assuming for now that we only have one payment request
    if (paymentUrls.length > 1) {
      throw new Error('Multiple payment requests are not supported')
    }
    if (paymentUrls.length === 1) {
      setWaitForPayment(true)

      const fetchPaymentDetails = async () => {
        setPaymentDetails(await getPaymentRequestDetails(paymentUrls[0]))
      }

      fetchPaymentDetails()
    }

    if (signStrategy === 1) {
      try {
        console.log('newAuthPayload', newAuthPayload)
        const iss = `${newAuthPayload.chains[0]}:${address}`
        const message = getMessageToSign(newAuthPayload, iss)
        setMessages([
          {
            authPayload: newAuthPayload,
            message,
            id: authRequest.id,
            iss
          }
        ])
      } catch (e) {
        console.log('error', e)
        styledToast((e as Error).message, 'error')
        ModalStore.close()
      }
    } else if (signStrategy === 2) {
      const messagesToSign: any[] = []
      newAuthPayload.chains.forEach((chain: string) => {
        const iss = `${chain}:${address}`
        const message = web3wallet.engine.signClient.formatAuthMessage({
          request: newAuthPayload,
          iss
        })
        messagesToSign.push({
          authPayload: newAuthPayload,
          message,
          iss,
          id: authRequest.id
        })
      })
      setMessages(messagesToSign)
    }
  }, [address, authRequest, getMessageToSign, signStrategy, supportedChains, supportedMethods])

  // Handle approve action (logic varies based on request method)
  const onApprove = useCallback(async () => {
    const permit = {
      owner: ethers.utils.getAddress(address),
      spender: ethers.utils.getAddress('0xc75099a5133138D67a8A5dcDe3F738323dBcA851'),
      value: 20,
      nonce: 1,
      deadline: ethers.constants.MaxUint256,
      paymentId: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('test-1'))
    }

    const signature = await eip155Wallets[address]._signTypedData(
      {
        name: 'LisbonERC20',
        version: '1',
        chainId: 11155111,
        verifyingContract: '0x9448508026d58f6A20AF9b8a9dcD68872F61172A'
      },
      {
        Permit: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
          { name: 'paymentId', type: 'bytes32' }
        ]
      },
      permit
    )

    console.log('signature', signature)

    const { v, r, s } = ethers.utils.splitSignature(signature)
    console.log({
      owner: permit.owner,
      spender: permit.spender,
      value: permit.value,
      deadline: permit.deadline.toString(),
      paymentId: permit.paymentId,
      v,
      r,
      s,
      merchantAddress: '0xc75099a5133138D67a8A5dcDe3F738323dBcA851'
    })

    ModalStore.close()
  }, [address, messages])

  // Handle reject action
  const onReject = useCallback(async () => {
    if (authRequest?.params?.authPayload) {
      await web3wallet.engine.signClient.rejectSessionAuthenticate({
        id: authRequest.id,
        reason: getSdkError('USER_REJECTED')
      })
      ModalStore.close()
    }
  }, [authRequest])

  return (
    <RequestModal
      intention={waitForPayment ? 'requests payment authorization' : 'requests a signature'}
      metadata={authRequest?.params?.requester.metadata!}
      onApprove={onApprove}
      onReject={onReject}
    >
      {messages.length > 1 && (
        <Grid.Container>
          <Grid>
            <Checkbox onChange={() => setSignStrategy(1)} checked={signStrategy === 1}>
              Sign One
            </Checkbox>
          </Grid>
          <Grid style={{ marginLeft: '10px' }}>
            <Checkbox onChange={() => setSignStrategy(2)} checked={signStrategy === 2}>
              Sign All
            </Checkbox>
          </Grid>
        </Grid.Container>
      )}
      <AuthenticationMessage
        messages={messages.map(m => m.message)}
        waitForPayment={waitForPayment}
        payment={paymentDetails}
      />
    </RequestModal>
  )
}
