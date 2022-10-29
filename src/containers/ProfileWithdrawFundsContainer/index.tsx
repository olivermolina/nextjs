import React, { useMemo, useState } from 'react';
import { PaymentMethodInterface } from '~/components/Profile/AccountDeposit/DepositMethod/DepositMethod';
import {
  PayoutAmountForm,
  PayoutMethodForm,
} from '~/components/Profile/WithdrawFunds';
import { PayoutAmountInputs } from '~/components/Profile/WithdrawFunds/PayoutAmountForm';
import { AchInputs } from '~/components/Profile/AccountDeposit/PaymentMethodForm/ACHForm';
import { UrlPaths } from '~/constants/UrlPaths';
import { useRouter } from 'next/router';
import BackdropLoading from '~/components/BackdropLoading';
import { trpc } from '~/utils/trpc';
import DeviceLocationContainer from '~/containers/DeviceLocationContainer';
import {
  GeolocationPermissionStatus,
  getGeolocationPermissionStatus,
} from '~/utils/getGeolocationPermissionStatus';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'react-toastify';
import { GIDXPaymentMethod, IDeviceGPS } from '~/lib/tsevo-gidx/GIDX';
import { ActionType } from '~/constants/ActionType';
import { PaymentMethodType } from '@prisma/client';

import PayoutConfirmation from '~/components/Profile/WithdrawFunds/PayoutConfirmation';
import { useAppSelector } from '~/state/hooks';

interface Props {
  clientIp: string;
}

const ProfileWithdrawFundsContainer = (props: Props) => {
  const { clientIp } = props;
  const router = useRouter();

  const userDetails = useAppSelector((state) => state.profile.userDetails);
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState<
    PaymentMethodInterface | undefined
  >();
  const [deviceGPS, setDeviceGPS] = useState<IDeviceGPS>({
    Latitude: 0,
    Longitude: 0,
  });
  const [openLocationDialog, setOpenLocationDialog] =
    React.useState<boolean>(false);
  const [nextLoading, setNextLoading] = React.useState<boolean>(false);
  const [payoutAmount, setPayoutAmount] = useState(0);
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodInterface>();

  const [newPaymentMethods, setNewPaymentMethods] = useState<
    GIDXPaymentMethod[]
  >([]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setNextLoading(false);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onPaymentSelect = (
    newSelectedPaymentMethod: PaymentMethodInterface,
  ) => {
    setSelectedPaymentMethod(newSelectedPaymentMethod);
  };

  const {
    mutateAsync: mutateCreateMerchantTransactionData,
    data: createMerchantTransactionData,
  } = trpc.user.createMerchantTransaction.useMutation();

  const { mutateAsync: mutateAccountVerify, data: verifiedData } =
    trpc.user.accountVerify.useMutation();

  const {
    mutateAsync: mutateAccountSavePaymentMethod,
    isLoading: savedPaymentMethodLoading,
  } = trpc.user.accountSavePaymentMethod.useMutation();

  const {
    mutateAsync: mutateAccountPayout,
    data: accountPayoutData,
    isLoading: accountPayoutLoading,
  } = trpc.user.accountPayout.useMutation();

  const handleCreateSession = async (payoutAmount: number) => {
    const permissionStatus = await getGeolocationPermissionStatus();
    if (permissionStatus !== GeolocationPermissionStatus.GRANTED) {
      setOpenLocationDialog(true);
      setNextLoading(false);
      return;
    }

    // Return if session already exists
    if (createMerchantTransactionData) return;

    const { session } = await mutateCreateMerchantTransactionData({
      ipAddress: clientIp,
      amountProcess: payoutAmount,
      amountBonus: 0,
      deviceGPS,
      serviceType: ActionType.PAYOUT,
    });

    await mutateAccountVerify({
      session,
    });
  };

  const handleSavePaymentMethod = async (data: AchInputs) => {
    if (!createMerchantTransactionData) return;

    try {
      const newPaymentMethod = await mutateAccountSavePaymentMethod({
        fullName: data.fullName,
        billingAddress: {
          address1: data?.address1 || verifiedData?.address1,
          address2: data?.address2 || verifiedData?.address2,
          city: data?.city || verifiedData?.city,
          state: data?.state || verifiedData?.state,
          postalCode: data?.postalCode || verifiedData?.postalCode,
          countyCode: 'US',
        },
        paymentMethod: {
          type: PaymentMethodType.ACH,
          ach: {
            accountNumber: data.accountNumber.toString().replaceAll(/\s/g, ''),
            routingNumber: data.routingNumber.toString().replaceAll(/\s/g, ''),
          },
        },
        session: createMerchantTransactionData.session,
      });
      if (newPaymentMethod) {
        setNewPaymentMethods((prevPaymentMethods) => [
          ...prevPaymentMethods,
          newPaymentMethod,
        ]);
      }
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
      return;
    }
  };

  const handleSubmitPayoutAmount = async (data: PayoutAmountInputs) => {
    setNextLoading(true);
    setPayoutAmount(data.payoutAmount);

    try {
      await handleCreateSession(data.payoutAmount);
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
      return;
    }
    setSelectedPaymentMethod(undefined);
    handleNext();
  };

  const handleCancel = async () => {
    setNextLoading(true);
    await router.push(UrlPaths.Challenge);
  };

  const steps = useMemo(
    () => [
      {
        key: 'payout-amount-form',
        content: (
          <PayoutAmountForm
            selectedPayoutMethod={selectedPayoutMethod}
            setSelectedPayoutMethod={setSelectedPayoutMethod}
            onSubmit={handleSubmitPayoutAmount}
            payoutAmount={payoutAmount}
          />
        ),
      },
      {
        key: 'payout-method-form',
        content: (
          <PayoutMethodForm
            selectedPayoutMethod={selectedPayoutMethod}
            payoutAmount={payoutAmount}
            handleBack={handleBack}
            handleCancel={handleCancel}
            verifiedData={verifiedData}
            savedPaymentMethods={[
              ...(createMerchantTransactionData?.gidxSession?.PaymentMethods
                ? createMerchantTransactionData.gidxSession.PaymentMethods
                : []),
              ...(newPaymentMethods ? newPaymentMethods : []),
            ]}
            selectedPaymentMethod={selectedPaymentMethod}
            onPaymentSelect={onPaymentSelect}
            handleSavePaymentMethod={handleSavePaymentMethod}
            isLoading={savedPaymentMethodLoading}
            user={userDetails}
          />
        ),
      },
      {
        key: 'payout-confirmation',
        content: (
          <PayoutConfirmation
            payoutAmount={payoutAmount}
            transaction={accountPayoutData}
          />
        ),
      },
    ],
    [
      selectedPayoutMethod,
      payoutAmount,
      verifiedData,
      createMerchantTransactionData,
      selectedPaymentMethod,
      newPaymentMethods,
      accountPayoutData,
    ],
  );

  const maxSteps = steps.length;

  const handleSubmitPayoutMethod = async () => {
    if (activeStep === 0) return;

    if (activeStep === maxSteps - 1) {
      await router.push(UrlPaths.Challenge);
      return;
    }

    if (
      selectedPayoutMethod?.type === PaymentMethodType.ACH &&
      !selectedPaymentMethod
    )
      return;

    if (!createMerchantTransactionData) return;

    try {
      const billingAddress =
        selectedPaymentMethod?.savedPaymentMethod?.BillingAddress;
      const result = await mutateAccountPayout({
        fullName:
          selectedPaymentMethod?.savedPaymentMethod?.NameOnAccount ||
          `${verifiedData?.firstname} ${verifiedData?.lastname}`,
        payoutAmount,
        paymentMethod: {
          type: selectedPayoutMethod?.type,
          ...(selectedPayoutMethod?.type === PaymentMethodType.ACH && {
            ach: {
              token: selectedPaymentMethod?.savedPaymentMethod?.Token,
              routingNumber:
                selectedPaymentMethod?.savedPaymentMethod?.RoutingNumber,
              accountNumber:
                selectedPaymentMethod?.savedPaymentMethod?.AccountNumber,
            },
          }),
          ...(selectedPayoutMethod?.type === PaymentMethodType.Paypal && {
            paypal: {
              // email: userDetails?.email,
              email: 'sb-es1qt22006179@personal.example.com',
            },
          }),
        },
        billingAddress: {
          address1: billingAddress?.AddressLine1 || verifiedData?.address1,
          address2: billingAddress?.AddressLine2 || verifiedData?.address2,
          city: billingAddress?.City || verifiedData?.city,
          state: billingAddress?.StateCode || verifiedData?.state,
          postalCode: billingAddress?.PostalCode || verifiedData?.postalCode,
          countyCode: 'US',
        },
        session: createMerchantTransactionData?.session,
        transaction: createMerchantTransactionData?.transaction,
      });
      if (result.status === 'Failed') {
        toast.error('Withdrawal Request Failed');
      } else {
        toast.success('Withdrawal Request Submitted');
      }
      handleNext();
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
    }
  };

  return (
    <div className="flex flex-col w-full h-full gap-4 lg:p-4">
      <BackdropLoading
        open={nextLoading || savedPaymentMethodLoading || accountPayoutLoading}
      />
      <DeviceLocationContainer
        deviceGPS={deviceGPS}
        setDeviceGPS={setDeviceGPS}
        openLocationDialog={openLocationDialog}
        setOpenLocationDialog={setOpenLocationDialog}
      />
      <div className="flex flex-col shadow-md rounded-md divide-y gap-2 bg-white w-full">
        <div className="flex flex-col p-6 gap-4">
          <p className="font-bold text-xl">Withdraw Funds</p>
          {steps[activeStep]?.content}
        </div>
        <div className="flex flex-col p-6 gap-2">
          <button
            className="p-4 capitalize text-white rounded font-bold w-auto h-auto bg-blue-600 disabled:opacity-50"
            type="submit"
            form="deposit-method-form"
            disabled={
              (activeStep === 0 && !selectedPayoutMethod) ||
              (activeStep === 1 &&
                !selectedPaymentMethod &&
                selectedPayoutMethod?.type === PaymentMethodType.ACH)
            }
            onClick={handleSubmitPayoutMethod}
          >
            {activeStep === 0 ? 'Next' : null}
            {activeStep === 1 ? 'Withdraw' : null}
            {activeStep === 2 ? 'Confirm' : null}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileWithdrawFundsContainer;
