import React, { useContext } from 'react';
import { Button } from '~/components/Button';
import { AccountDepositContext } from './AccountDeposit';

const DepositMethod = () => {
  const {
    depositAmount,
    handleBack,
    handleNext,
    paymentMethods,
    onPaymentSelect,
    selectedPaymentMethod,
  } = useContext(AccountDepositContext);
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
                href="javascript:void(0);"
                className="no-underline hover:underline"
                onClick={handleBack}
              >
                Return
              </a>
              <span> / </span>
              <a
                href="javascript:void(0);"
                className="no-underline hover:underline"
                onClick={handleBack}
              >
                Cancel
              </a>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-10 w-full mt-5">
          <div className="grid grid-cols-2 sm:grid-rows-2 sm:grid-cols-3 md:grid-rows-2 md:grid-cols-3 lg:grid-rows-1 lg:grid-flow-col lg:auto-cols-max gap-5 place-items-center ">
            {paymentMethods.map(({ key, image }) => (
              <img
                key={key}
                src={image}
                className={`object-cover w-[136px] h-[80px] shadow-md cursor-pointer transform transition duration-500 hover:scale-110 hover:border-4 hover:border-orange-300
                ${
                  selectedPaymentMethod === key
                    ? 'border-4 border-orange-300'
                    : ''
                }
                `}
                onClick={() => onPaymentSelect?.(key)}
                alt={key}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col p-6 gap-2">
        <Button variant="primary" width={'auto'} onClick={handleNext}>
          <p>Deposit</p>
        </Button>
      </div>
    </div>
  );
};

export default DepositMethod;
