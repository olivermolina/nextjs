import React, { Dispatch, SetStateAction, useEffect } from 'react';
import classNames from 'classnames';
import { FormErrorText } from '~/components/Form/FormErrorText';
import { Grid, Stack } from '@mui/material';
import { PaymentMethodType } from '@prisma/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PaymentMethodInterface } from '~/components/Profile/AccountDeposit/DepositMethod/DepositMethod';
import * as Yup from 'yup';
import Icons from '~/components/Icons/Icons';

const PAYOUT_METHODS = [
  {
    key: PaymentMethodType.ACH,
    image: <Icons.Bank className={'h-8'} />,
    type: PaymentMethodType.ACH,
    label: 'Bank Transfer',
  },
  {
    key: PaymentMethodType.Paypal,
    image: <Icons.Paypal className={'h-8'} />,
    type: PaymentMethodType.Paypal,
    label: 'Paypal',
  },
];

export type PayoutAmountInputs = {
  payoutAmount: number;
};

const InputValidationSchema = Yup.object().shape({
  payoutAmount: Yup.number()
    .typeError('Please provide payout amount')
    .min(10, 'Minimum payout amount is $10'),
});
const styles = {
  defaultClasses:
    'block pl-11 pr-2 appearance-none font-bold text-lg w-full h-full rounded-md bg-white focus:outline-gray-200',
  errorClasses: 'border-2 border-red-500 focus:outline-red-500',
  selectedDeposit: 'border-4 border-blue-300',
  defaultDepositButton:
    'transform transition duration-500 hover:scale-110 hover:border-4 hover:border-blue-300  border border-gray-200 rounded-md shadow w-auto py-2 min-h-[75px]',
  bonusDepositButton: 'min-h-[105px]',
};

interface Props {
  payoutAmount: number;
  onSubmit: (data: PayoutAmountInputs) => void;
  setSelectedPayoutMethod: Dispatch<
    SetStateAction<PaymentMethodInterface | undefined>
  >;
  selectedPayoutMethod?: PaymentMethodInterface;
}

const PayoutAmountForm = (props: Props) => {
  const { payoutAmount } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PayoutAmountInputs>({
    resolver: yupResolver(InputValidationSchema),
    shouldUnregister: false,
    defaultValues: { payoutAmount },
  });
  const handleClick = (selected: PaymentMethodInterface) => {
    props.setSelectedPayoutMethod(selected);
  };

  const onSubmit: SubmitHandler<PayoutAmountInputs> = async (data) => {
    props.onSubmit(data);
  };

  useEffect(() => {
    if (payoutAmount) {
      reset({ payoutAmount });
    }
  }, [payoutAmount]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={'deposit-method-form'}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <p className="text-sm">
            Enter payout amount and select payout method to withdraw.
          </p>
          <div className="relative border border-gray-200 rounded-md bg-gray-200 ml-50 h-[62px]">
            <div
              className={classNames(
                'flex absolute inset-y-0 left-0 items-center pointer-events-none bg-inherit p-2 rounded-l-md',
                errors?.payoutAmount
                  ? 'border-2 border-red-500 focus:outline-red-500'
                  : '',
              )}
            >
              <span className="font-bold text-lg">$</span>
            </div>
            <input
              type="number"
              placeholder="Enter amount"
              className={classNames(
                styles.defaultClasses,
                errors?.payoutAmount ? styles.errorClasses : '',
              )}
              defaultValue={''}
              {...register('payoutAmount')}
            />
            <FormErrorText>{errors.payoutAmount?.message}</FormErrorText>
          </div>
          <p
            className={classNames('text-sm', {
              'mt-2': errors.payoutAmount?.message,
            })}
          >
            My Available Balance: <span className={'font-bold'}>$100.00</span>
          </p>
        </div>
        <div className={'flex flex-col gap-5'}>
          <p className="font-bold text-md">Select Payout Method</p>
          <Grid
            container
            direction="row"
            justifyContent={{ xs: 'space-evenly', md: 'flex-start' }}
            spacing={4}
          >
            {PAYOUT_METHODS.map((payoutMethod) => (
              <Grid
                item
                key={payoutMethod.key}
                onClick={() => handleClick(payoutMethod)}
              >
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                  className={classNames(
                    `shadow-md rounded-lg cursor-pointer transform transition duration-500 hover:scale-y-100 hover:border-4 hover:border-blue-300 w-[150px] h-[95px] p-2`,
                    {
                      'border-4 border-blue-300':
                        props.selectedPayoutMethod?.key === payoutMethod?.key,
                    },
                  )}
                >
                  {payoutMethod.image}
                  <span>{payoutMethod.label}</span>
                </Stack>
              </Grid>
            ))}
          </Grid>
          {props.selectedPayoutMethod?.key === PaymentMethodType.ACH ? (
            <p className="text-sm">
              Processing time:{' '}
              <span className="font-bold">1-2 Business Days</span>
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
};

export default PayoutAmountForm;
