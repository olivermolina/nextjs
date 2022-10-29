import React, { useMemo, useState } from 'react';
import visa from '~/assets/visa-dark.svg';
import mastercard from '~/assets/mastercard.svg';
import amex from '~/assets/amex.svg';
import discover from '~/assets/discover.svg';
import paypal from '~/assets/paypal.svg';
import ftx from '~/assets/FTX_Logo_black.svg';
import ach from '~/assets/ach.svg';
import { CardTypes } from '~/constants/CardTypes';
import {
  DepositAmount,
  DepositConfirmation,
  DepositMethod,
} from '~/components/Profile/AccountDeposit';
import { PaymentMethodInterface } from '~/components/Profile/AccountDeposit/DepositMethod/DepositMethod';
import {
  BillingAddressInterface,
  GidxPaymentMethodInterface,
  IDeviceGPS,
  UserDetailsInput,
} from '~/lib/tsevo-gidx/GIDX';
import { trpc } from '~/utils/trpc';
import GetVerifiedDialog from '~/components/Profile/GetVerifiedDialog';
import {
  GeolocationPermissionStatus,
  getGeolocationPermissionStatus,
} from '~/utils/getGeolocationPermissionStatus';
import { toast } from 'react-toastify';
import { AccountDepositResponseInterface } from '~/server/controller/users/accountDeposit';
import DepositDeclineDialog from '~/components/Profile/AccountDeposit/DepositDeclineDialog';
import { TRPCClientError } from '@trpc/client';
import { useRouter } from 'next/router';
import { UrlPaths } from '~/constants/UrlPaths';
import { useAppSelector } from '~/state/hooks';
import { AppSettingName, PaymentMethodType } from '@prisma/client';
import SessionExpiredDialog from '~/components/Profile/AccountDeposit/SessionExpiredDialog';
import BackdropLoading from '~/components/BackdropLoading';
import DeviceLocationContainer from '~/containers/DeviceLocationContainer';
import { ActionType } from '~/constants/ActionType';

export const PAYMENT_METHODS = [
  {
    key: CardTypes.visa,
    image: visa,
    object: 'object-cover',
    type: PaymentMethodType.CC,
  },
  {
    key: CardTypes.mastercard,
    image: mastercard,
    object: 'object-cover',
    type: PaymentMethodType.CC,
  },
  {
    key: CardTypes.amex,
    image: amex,
    object: 'object-cover',
    type: PaymentMethodType.CC,
  },
  {
    key: CardTypes.discover,
    image: discover,
    object: 'object-cover',
    type: PaymentMethodType.CC,
  },
  {
    key: 'paypal',
    image: paypal,
    object: 'object-cover',
    type: PaymentMethodType.Paypal,
  },
  {
    key: 'ftx',
    image: ftx,
    object: 'object-fit',
    type: PaymentMethodType.FTX,
  },
  {
    key: 'ach',
    image: ach,
    object: 'object-fit',
    type: PaymentMethodType.ACH,
  },
];

interface AccountDepositContainerProps {
  clientIp: string;
}

export interface PaymentFormDataInterface {
  fullName: string;
  billingAddress: BillingAddressInterface;
  paymentMethod: GidxPaymentMethodInterface;
}

const AccountDepositContainer = ({
  clientIp,
}: AccountDepositContainerProps) => {
  const router = useRouter();
  const [nextLoading, setNextLoading] = React.useState<boolean>(false);
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [openSessionExpiredDialog, setOpenSessionExpiredDialog] =
    React.useState<boolean>(false);
  const [openDeclineDialog, setOpenDeclineDialog] =
    React.useState<boolean>(false);

  const [openVerifyDialog, setOpenVerifyDialog] =
    React.useState<boolean>(false);
  const [deviceGPS, setDeviceGPS] = useState<IDeviceGPS>({
    Latitude: 0,
    Longitude: 0,
  });
  const [openLocationDialog, setOpenLocationDialog] =
    React.useState<boolean>(false);

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodInterface>();
  const [transaction, setTransaction] =
    useState<AccountDepositResponseInterface>();

  const { userDetails, appSettings } = useAppSelector((state) => state.profile);
  const isFirstDeposit = userDetails?.isFirstDeposit;

  const { mutateAsync: mutateAccountVerify, data: verifiedData } =
    trpc.user.accountVerify.useMutation();

  const { mutateAsync: mutateAccountDeposit, isLoading } =
    trpc.user.accountDeposit.useMutation();

  const {
    mutateAsync: mutateCreateMerchantTransactionData,
    data: createMerchantTransactionData,
  } = trpc.user.createMerchantTransaction.useMutation();

  const {
    mutateAsync: mutateAccountRegister,
    isLoading: mutateAccountRegisterLoading,
    error: registerError,
  } = trpc.user.accountRegister.useMutation();

  const maxMatchDeposit = Number(
    appSettings?.find(
      (appSetting) =>
        appSetting.name === AppSettingName.MAX_MATCH_DEPOSIT_AMOUNT,
    )?.value || 0,
  );

  const handleSubmitDeposit = async (data?: PaymentFormDataInterface) => {
    if (!selectedPaymentMethod || !data) return;

    if (!createMerchantTransactionData) return;

    try {
      const creditAmount =
        depositAmount <= maxMatchDeposit ? depositAmount : maxMatchDeposit;

      return await mutateAccountDeposit({
        ...data,
        amountProcess: depositAmount,
        amountBonus: isFirstDeposit ? creditAmount : 0,
        session: createMerchantTransactionData?.session,
        transaction: createMerchantTransactionData?.transaction,
      });
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
    }
  };

  const handleSubmitRegisterUser = async (userDetails: UserDetailsInput) => {
    if (!createMerchantTransactionData) return;

    try {
      await mutateAccountRegister({
        userDetails,
        session: createMerchantTransactionData?.session,
      });
      setOpenVerifyDialog(false);
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e?.message);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onPaymentSelect = (
    newSelectedPaymentMethod: PaymentMethodInterface,
  ) => {
    setSelectedPaymentMethod(newSelectedPaymentMethod);
  };

  const handleCancel = async () => {
    setNextLoading(true);
    await router.push(UrlPaths.Challenge);
    setNextLoading(false);
  };

  const handleNext = async (data?: PaymentFormDataInterface) => {
    setNextLoading(true);

    if (activeStep === maxSteps - 1) {
      await router.push(UrlPaths.Challenge);
      setNextLoading(false);
      return;
    }

    const permissionStatus = await getGeolocationPermissionStatus();
    if (permissionStatus !== GeolocationPermissionStatus.GRANTED) {
      setOpenLocationDialog(true);
      setNextLoading(false);
      return;
    }

    if (depositAmount === 0) {
      setNextLoading(false);
      return;
    }

    if (!createMerchantTransactionData) {
      const creditAmount =
        depositAmount <= maxMatchDeposit ? depositAmount : maxMatchDeposit;
      const { session } = await mutateCreateMerchantTransactionData({
        ipAddress: clientIp,
        amountProcess: depositAmount,
        amountBonus: creditAmount,
        deviceGPS,
        serviceType: ActionType.PAY,
      });
      const result = await mutateAccountVerify({
        session,
      });
      if (!result) {
        setOpenVerifyDialog(true);
        setNextLoading(false);
        return;
      }
    }

    if (activeStep === 1 && data) {
      if (transaction) {
        setOpenSessionExpiredDialog(true);
        setNextLoading(false);
        return;
      }

      const newTransaction = await handleSubmitDeposit(data);
      if (!newTransaction) {
        return;
      }

      setTransaction(newTransaction);
      if (newTransaction && newTransaction.status === 'Failed') {
        setOpenDeclineDialog(true);
        setNextLoading(false);
        return;
      }
    }

    setNextLoading(false);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handlePaypalFtxNext = async (data: PaymentFormDataInterface) => {
    const transaction = await handleSubmitDeposit(data);
    setTransaction(transaction);
    return transaction;
  };

  const steps = useMemo(
    () => [
      {
        label: 'Input Deposit',
        content: (
          <DepositAmount
            setDepositAmount={setDepositAmount}
            handleNext={handleNext}
            isFirstDeposit={isFirstDeposit}
            depositAmount={depositAmount}
            maxMatchDeposit={maxMatchDeposit}
          />
        ),
      },
      {
        label: 'Choose method',
        content: (
          <DepositMethod
            depositAmount={depositAmount}
            handleBack={handleBack}
            handleNext={handleNext}
            paymentMethods={PAYMENT_METHODS}
            onPaymentSelect={onPaymentSelect}
            selectedPaymentMethod={selectedPaymentMethod}
            deviceGPS={deviceGPS}
            verifiedData={verifiedData}
            handleCancel={handleCancel}
            savedPaymentMethods={
              createMerchantTransactionData?.gidxSession.PaymentMethods
            }
            handlePaypalFtxNext={handlePaypalFtxNext}
          />
        ),
      },
      {
        label: 'Confirmation',
        content: (
          <DepositConfirmation
            depositAmount={depositAmount}
            handleBack={handleBack}
            handleNext={handleNext}
            transaction={transaction}
            handleCancel={handleCancel}
          />
        ),
      },
    ],
    [
      activeStep,
      isFirstDeposit,
      depositAmount,
      selectedPaymentMethod,
      deviceGPS,
      transaction,
      maxMatchDeposit,
      handleNext,
      handleBack,
    ],
  );

  const maxSteps = steps.length;

  return (
    <div className="flex flex-col w-full h-full gap-4 lg:p-4">
      {steps[activeStep]?.content}
      <BackdropLoading open={isLoading || nextLoading} />
      <DeviceLocationContainer
        deviceGPS={deviceGPS}
        setDeviceGPS={setDeviceGPS}
        openLocationDialog={openLocationDialog}
        setOpenLocationDialog={setOpenLocationDialog}
      />
      <GetVerifiedDialog
        open={openVerifyDialog}
        handleClose={() => setOpenVerifyDialog(false)}
        onSubmit={handleSubmitRegisterUser}
        isLoading={mutateAccountRegisterLoading}
        hasError={!!registerError}
      />
      <DepositDeclineDialog
        open={openDeclineDialog}
        setOpen={setOpenDeclineDialog}
        type={selectedPaymentMethod?.type}
        errorCode={transaction?.code}
        errorMessage={transaction?.errorMessage}
      />
      <SessionExpiredDialog
        setOpen={setOpenSessionExpiredDialog}
        open={openSessionExpiredDialog}
      />
    </div>
  );
};

export default AccountDepositContainer;
