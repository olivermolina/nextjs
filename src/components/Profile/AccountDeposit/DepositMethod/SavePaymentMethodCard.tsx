import React from 'react';
import classNames from 'classnames';
import { GIDXPaymentMethod } from '~/lib/tsevo-gidx/GIDX';
import { PaymentMethodInterface } from '~/components/Profile/AccountDeposit/DepositMethod/DepositMethod';
import { PaymentMethodType } from '@prisma/client';
import CreditCard from '~/assets/credit-card.svg';
import ACH from '~/assets/ach.svg';

interface Props {
  paymentMethods: PaymentMethodInterface[];
  paymentMethod: GIDXPaymentMethod;
  selectedPaymentMethod?: PaymentMethodInterface;
  onPaymentSelect?: (selectedPaymentMethod: PaymentMethodInterface) => void;
}

const SavePaymentMethodCard = (props: Props) => {
  const {
    paymentMethod,
    paymentMethods,
    selectedPaymentMethod,
    onPaymentSelect,
  } = props;

  return (
    <div
      key={paymentMethod.Token}
      className={classNames(
        `flex flex-col justify-between p-2 shadow-md rounded-lg cursor-pointer transform transition duration-500 hover:scale-y-100 hover:border-4 hover:border-blue-300 min-h-[107px] min-w-[170px]`,
        {
          'border-4 border-blue-300':
            selectedPaymentMethod?.key === paymentMethod?.Token,
        },
      )}
      onClick={() => {
        const selectedPaymentMethod = paymentMethods.find(
          (row) => row.type === paymentMethod.Type,
        );
        if (selectedPaymentMethod) {
          onPaymentSelect?.({
            key: paymentMethod.Token,
            type: paymentMethod.Type as PaymentMethodType,
            image: CreditCard,
            savedPaymentMethod: paymentMethod,
          });
        }
      }}
    >
      {paymentMethod?.Type === PaymentMethodType.CC && (
        <div>
          <CreditCard height={35} width={35} />
          <p>Card: {paymentMethod.DisplayName}</p>
          <p>Expiry Date: {paymentMethod.ExpirationDate}</p>
        </div>
      )}
      {paymentMethod?.Type === PaymentMethodType.ACH && (
        <div>
          <ACH height={35} width={35} />
          <p>Account: {paymentMethod.DisplayName}</p>
          <p>Routing: {paymentMethod.RoutingNumber}</p>
        </div>
      )}
    </div>
  );
};

export default SavePaymentMethodCard;
