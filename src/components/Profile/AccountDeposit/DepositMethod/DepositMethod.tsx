import React, { useState } from 'react';
import PaymentMethodForm from '~/components/Profile/AccountDeposit/PaymentMethodForm';
import { SubmitHandler } from 'react-hook-form';
import { CreditCardInputs } from '~/components/Profile/AccountDeposit/PaymentMethodForm/CreditCardForm';
import classNames from 'classnames';
import { ReactComponent } from '~/components/Icons/Icons';
import {
  GIDXPaymentMethod,
  IDeviceGPS,
  UserDetailsInput,
} from '~/lib/tsevo-gidx/GIDX';
import { PaymentFormDataInterface } from '~/containers/ProfileAccountDepositContainer';
import { AchInputs } from '~/components/Profile/AccountDeposit/PaymentMethodForm/ACHForm';
import { PaymentMethodType } from '@prisma/client';
import PaymentMethodRadioButtonsGroup, {
  PaymentMethodRadioOptions,
} from '~/components/Profile/AccountDeposit/DepositMethod/PaymentMethodRadioButtonsGroup';
import { Grid } from '@mui/material';
import SavedPaymentMethodCardList from '~/components/Profile/AccountDeposit/SavedPaymentMethodCardList';
import { AccountDepositResponseInterface } from '~/server/routers/user/accountDeposit';

export interface PaymentMethodInterface {
  key: string;
  image: ReactComponent | JSX.Element;
  type: PaymentMethodType;
  label?: string;
  savedPaymentMethod?: GIDXPaymentMethod;
}

interface DepositMethodProps {
  depositAmount: number;
  handleBack: () => void;
  handleNext: (data?: PaymentFormDataInterface) => void;
  paymentMethods: PaymentMethodInterface[];
  selectedPaymentMethod?: PaymentMethodInterface;
  onPaymentSelect?: (selectedPaymentMethod: PaymentMethodInterface) => void;
  deviceGPS: IDeviceGPS;
  verifiedData?: UserDetailsInput;
  handleCancel: () => void;
  savedPaymentMethods?: GIDXPaymentMethod[];
  handlePaypalFtxNext: (
    data: PaymentFormDataInterface,
  ) => Promise<AccountDepositResponseInterface | undefined>;
}

const DepositMethod = (props: DepositMethodProps) => {
  const {
    depositAmount,
    handleBack,
    handleNext,
    paymentMethods,
    onPaymentSelect,
    handleCancel,
    selectedPaymentMethod,
    savedPaymentMethods,
    verifiedData,
    handlePaypalFtxNext,
  } = props;

  const onSubmit: SubmitHandler<CreditCardInputs | AchInputs> = async (
    data,
  ) => {
    await handleNext?.({
      fullName: `${verifiedData?.firstname}  ${verifiedData?.lastname}`,
      billingAddress: {
        address1: data?.address1 || verifiedData?.address1,
        address2: data?.address2 || verifiedData?.address2,
        city: data?.city || verifiedData?.city,
        state: data?.state || verifiedData?.state,
        postalCode: data?.postalCode || verifiedData?.postalCode,
        countyCode: 'US',
      },
      paymentMethod: {
        type: selectedPaymentMethod?.type,
        ...(selectedPaymentMethod?.type === PaymentMethodType.CC && {
          creditCard: {
            token: (data as CreditCardInputs).token,
            cardNumber: (data as CreditCardInputs).cardNumber
              .toString()
              .replaceAll(/\s/g, ''),
            cardExpirationDate: (data as CreditCardInputs).expireDate,
            cvv: (data as CreditCardInputs).cvv,
            cardType: selectedPaymentMethod?.key,
          },
        }),
        ...(selectedPaymentMethod?.type === PaymentMethodType.ACH && {
          ach: {
            token: (data as AchInputs).token,
            accountNumber: (data as AchInputs).accountNumber
              .toString()
              .replaceAll(/\s/g, ''),
            routingNumber: (data as AchInputs).routingNumber
              .toString()
              .replaceAll(/\s/g, ''),
          },
        }),
      },
    });
  };

  const handleChangePaymentMethod = async (key: string) => {
    const newPaymentMethod = paymentMethods.find(
      (paymentMethod) => paymentMethod.key === key,
    );
    if (newPaymentMethod) onPaymentSelect?.(newPaymentMethod);
  };

  const [paymentMethodOption, setPaymentMethodOption] =
    useState<PaymentMethodRadioOptions>(PaymentMethodRadioOptions.SAVED);

  return (
    <div className="flex flex-col shadow-md rounded-md divide-y gap-2 bg-white">
      <div className="flex flex-col p-6 gap-2">
        <p className="font-bold text-lg">
          Select deposit method below to continue Deposit
        </p>
        <div className="flex gap-1">
          <span className={'font-bold text-sm'}>$</span>
          <div>
            <p className="font-bold text-3xl">{depositAmount.toFixed(2)}</p>
            <p className={'text-gray-400 text-sm'}>
              <a
                href={void 0}
                className="no-underline hover:underline cursor-pointer"
                onClick={handleBack}
              >
                Return
              </a>
              <span> / </span>
              <a
                href={void 0}
                className="no-underline hover:underline cursor-pointer"
                onClick={handleCancel}
              >
                Cancel
              </a>
            </p>
          </div>
        </div>
        <div>
          <PaymentMethodRadioButtonsGroup
            selectedPaymentMethodOptionCallback={setPaymentMethodOption}
          />
        </div>

        {paymentMethodOption === PaymentMethodRadioOptions.SAVED && (
          <SavedPaymentMethodCardList
            paymentMethods={paymentMethods}
            onPaymentSelect={onPaymentSelect}
            selectedPaymentMethod={selectedPaymentMethod}
            savedPaymentMethods={savedPaymentMethods}
          />
        )}

        {paymentMethodOption === PaymentMethodRadioOptions.NEW && (
          <Grid
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
            spacing={2}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {paymentMethods.map((paymentMethod) => {
              const Image = paymentMethod.image as ReactComponent;
              return (
                <Grid item key={paymentMethod.key}>
                  <Image
                    className={classNames(
                      `shadow-md rounded-lg cursor-pointer transform transition duration-500 hover:scale-y-100 hover:border-4 hover:border-blue-300`,
                      {
                        'border-4 border-blue-300':
                          selectedPaymentMethod?.key === paymentMethod?.key,
                      },
                    )}
                    width={94}
                    height={64}
                    onClick={() => onPaymentSelect?.(paymentMethod)}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </div>

      <PaymentMethodForm
        selectedPaymentMethod={selectedPaymentMethod}
        handleChangePaymentMethod={handleChangePaymentMethod}
        verifiedData={verifiedData}
        onSubmit={onSubmit}
        depositAmount={depositAmount}
        handlePaypalFtxNext={handlePaypalFtxNext}
        handleNext={handleNext}
      />
      <div className="flex flex-col p-6 gap-2">
        <button
          className="p-4 capitalize text-white rounded font-bold w-auto h-auto bg-blue-600 disabled:opacity-50"
          type="submit"
          disabled={!selectedPaymentMethod}
          form="deposit-method-form"
        >
          Deposit
        </button>
      </div>
    </div>
  );
};

export default DepositMethod;
