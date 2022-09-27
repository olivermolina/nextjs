import React, {
  ChangeEvent,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { Button } from '~/components/Button';
import { AccountDepositContext } from './AccountDeposit';

const DepositInputAmount = () => {
  const { depositAmount, setDepositAmount, handleNext } = useContext(
    AccountDepositContext,
  );

  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (
    amount: number,
    index: SetStateAction<number | null>,
  ) => {
    setDepositAmount?.(amount);
    setSelected(index);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDepositAmount?.(Number(e.target.value));
    setSelected(null);
  };

  return (
    <div className="flex flex-col shadow-md rounded-md divide-y gap-2 bg-white">
      <div className="flex flex-col p-6 gap-2">
        <p className="font-bold text-lg">Account Deposit</p>
        <p className="text-sm">
          Select your deposit amount from the amounts shown below. or enter your
          own amount and click the &quot;Deposit&quot;.
        </p>
        <div className="grid grid-cols-2 justify-items-stretch gap-5 lg:gap-10 w-full mt-5">
          <div className="grid grid-cols-4 gap-2 justify-items-stretch">
            {[10, 50, 100, 250].map((amount, index) => (
              <button
                key={amount}
                className={`border border-gray-200 rounded-md font-bold text-md lg:text-lg shadow w-auto
                  ${selected === index ? 'border-4 border-blue-200' : ''}
                  `}
                onClick={() => handleSelect(amount, index)}
              >
                ${amount}
              </button>
            ))}
          </div>
          <div className="relative border border-gray-200 rounded-md bg-gray-200 ml-50 h-[62px]">
            <div className="flex absolute inset-y-0 left-0 items-center pointer-events-none bg-inherit p-2 rounded-l-md">
              <span className="font-bold text-lg">$</span>
            </div>
            <input
              type={'number'}
              className="block pl-11 pr-2 text-right appearance-none font-bold text-lg w-full h-full rounded-md bg-white focus:outline-gray-200"
              value={depositAmount}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col p-6 gap-2">
        <Button variant="primary" width={'auto'} onClick={handleNext}>
          <p>Deposit</p>
        </Button>
        <p className="text-sm">
          Next: Select your deposit Method and save it to your secure wallet for
          future transactions.
        </p>
      </div>
    </div>
  );
};

export default DepositInputAmount;
