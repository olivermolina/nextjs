import React, { useContext } from 'react';
import { Button } from '~/components/Button';
import { AccountDepositContext } from './AccountDeposit';

const DepositConfirmation = () => {
  const { depositAmount, handleBack, handleNext } = useContext(
    AccountDepositContext,
  );
  return (
    <div className="flex flex-col shadow-md rounded-md divide-y gap-2 bg-white">
      <div className="flex flex-col p-6 gap-2">
        <p className="font-bold text-lg">Account Deposit</p>
        <p className="text-sm">
          Review your deposit information below and then click finalize
        </p>
        <div className="flex gap-1">
          <span className={'font-bold text-sm'}>$</span>
          <div>
            <p className="font-bold text-3xl">{depositAmount.toFixed(2)}</p>
            <p className={'text-gray-400 text-sm'}>
              <a
                href="javascript:void(null);"
                className="no-underline hover:underline"
                onClick={handleBack}
              >
                Return
              </a>
              <span> / </span>
              <a
                href="javascript:void(null);"
                className="no-underline hover:underline"
                onClick={handleBack}
              >
                Cancel
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col px-6 py-2 gap-2">
        <div className={'flex flex-col gap-2'}>
          <div className={'flex justify-between text-sm'}>
            <span>Transaction ID:</span>
            <span className={'font-bold'}>1234567888</span>
          </div>
          <div className={'flex justify-between text-sm'}>
            <span>Payment Method:</span>
            <span className={'font-bold'}>Visa **** **** **** 2311</span>
          </div>
          <div className={'flex justify-between text-sm'}>
            <span>Status:</span>
            <span className={'font-bold'}>Approved</span>
          </div>
          <div className={'flex justify-between text-sm'}>
            <span>Date/Time:</span>
            <span className={'font-bold'}>09/01/200 2:32 PM GMT</span>
          </div>
          <div className={'flex justify-between text-sm'}>
            <span>Deposit AMT:</span>
            <span className={'font-bold'}>${depositAmount.toFixed(2)}</span>
          </div>
          <div className={'flex justify-between text-sm'}>
            <span>Deposit Fee:</span>
            <span className={'font-bold'}>$0</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-6 gap-2">
        <Button variant="primary" width={'auto'} onClick={handleNext}>
          <p>Finalize Deposit</p>
        </Button>
        <p className="text-sm">
          Next: It may take to 60 seconds for this deposit amount to show as
          credited in your account.
        </p>
      </div>
    </div>
  );
};

export default DepositConfirmation;
