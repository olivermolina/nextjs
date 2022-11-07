import React from 'react';
import CartContainer from '~/containers/CartContainer/CartContainer';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';

function Cart() {
  return (
    <LayoutContainer>
      <div className="w-full">
        <CartContainer />
      </div>
    </LayoutContainer>
  );
}

export default Cart;
