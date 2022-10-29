import React from 'react';
import { Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SavePaymentMethodCard from '~/components/Profile/AccountDeposit/DepositMethod/SavePaymentMethodCard';
import { GIDXPaymentMethod } from '~/lib/tsevo-gidx/GIDX';
import { PaymentMethodInterface } from '~/components/Profile/AccountDeposit/DepositMethod/DepositMethod';

interface Props {
  savedPaymentMethods?: GIDXPaymentMethod[];
  onPaymentSelect?: (selectedPaymentMethod: PaymentMethodInterface) => void;
  selectedPaymentMethod?: PaymentMethodInterface;
  paymentMethods: PaymentMethodInterface[];
  showAddButton?: boolean;
  handleAdd?: () => void;
}

const SavedPaymentMethodCardList = (props: Props) => {
  const {
    paymentMethods,
    savedPaymentMethods,
    onPaymentSelect,
    selectedPaymentMethod,
    showAddButton,
    handleAdd,
  } = props;
  return (
    <Grid
      container
      direction="row"
      justifyContent={{ xs: 'space-evenly', md: 'flex-start' }}
      alignItems="center"
      spacing={2}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      {savedPaymentMethods?.map((paymentMethod) => (
        <Grid item key={paymentMethod.Token}>
          <SavePaymentMethodCard
            paymentMethod={paymentMethod}
            paymentMethods={paymentMethods}
            onPaymentSelect={onPaymentSelect}
            selectedPaymentMethod={selectedPaymentMethod}
          />
        </Grid>
      ))}

      {showAddButton ? (
        <Grid item>
          <div
            className={`flex flex-col items-center justify-center p-2 shadow-md rounded-lg cursor-pointer transform transition duration-500 hover:scale-y-100 hover:border-4 hover:border-blue-300 min-h-[107px] min-w-[170px]`}
            onClick={handleAdd}
          >
            <AddIcon fontSize={'large'} />
          </div>
        </Grid>
      ) : null}
    </Grid>
  );
};

export default SavedPaymentMethodCardList;
