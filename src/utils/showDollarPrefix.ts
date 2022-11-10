export const showDollarPrefix = (value: number, isShow: boolean) => {
  return isShow ? `$${value}` : value;
};
