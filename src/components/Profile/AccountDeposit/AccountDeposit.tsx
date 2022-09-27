import React, { Dispatch, SetStateAction, useState } from 'react';
import DepositInputAmount from './DepositAmount';
import DepositMethod from './DepositMethod';
import DepositConfirmation from './DepositConfirmation';

interface PaymentMethodInterface {
  key: string;
  image: string;
}

interface AccountDepositContextType {
  depositAmount: number;
  setDepositAmount?: Dispatch<SetStateAction<number>>;
  handleNext?: () => void;
  handleBack?: () => void;
  paymentMethods: PaymentMethodInterface[];
  selectedPaymentMethod: string;
  onPaymentSelect?: (selectedPaymentMethod: string) => void;
}

export const AccountDepositContext =
  React.createContext<AccountDepositContextType>({
    depositAmount: 0,
    paymentMethods: [],
    selectedPaymentMethod: '',
  });

const steps = [
  {
    label: 'Input Deposit',
    content: <DepositInputAmount />,
  },
  {
    label: 'Choose method',
    content: <DepositMethod />,
  },
  {
    label: 'Confirmation',
    content: <DepositConfirmation />,
  },
];

interface AccountDepositProps {
  paymentMethods: PaymentMethodInterface[];
  handleSubmitDeposit?: () => void;
}

const AccountDeposit = (props: AccountDepositProps) => {
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<any>(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(0);

  const maxSteps = steps.length;

  const handleNext = () => {
    if (activeStep === maxSteps - 1) {
      props.handleSubmitDeposit?.();
      return;
    }

    if (depositAmount !== 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onPaymentSelect = (newSelectedPaymentMethod: string) => {
    setSelectedPaymentMethod(newSelectedPaymentMethod);
  };

  return (
    <AccountDepositContext.Provider
      value={{
        depositAmount,
        handleNext,
        handleBack,
        setDepositAmount,
        paymentMethods: props.paymentMethods,
        selectedPaymentMethod: selectedPaymentMethod,
        onPaymentSelect: onPaymentSelect,
      }}
    >
      <div className="flex flex-col w-full h-full gap-4 lg:p-4">
        {steps[activeStep]?.content}
      </div>
    </AccountDepositContext.Provider>
  );
};

export default AccountDeposit;
