interface VisanetCheckoutType {
  configure: (config: {
    sessiontoken: string;
    channel: string;
    merchantid: string;
    purchasenumber: string;
    amount: number;
    currency: string;
    action: string;
    timeouturl: string;
  }) => void;
  open: () => void;
}

declare const VisanetCheckout: VisanetCheckoutType;
