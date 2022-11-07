import { NextPageWithLayout } from '../_app';
import CartContainer from '~/containers/CartContainer/CartContainer';
import ContestPickerContainer from '~/containers/ContestContainer/ContestPickerContainer';
import MatchPickerTableContainer from '~/containers/MatchPickerTableContainer/MatchPickerTableContainer';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import { GetServerSideProps } from 'next';
import { withAuth } from '~/hooks/withAuthServerSideProps';
import ContestPickerCategoryContainer from '~/containers/ContestPickerCategoryContainer/ContestPickerCategoryContainer';

const IndexPage: NextPageWithLayout = () => {
  return (
    <LayoutContainer>
      <div className="grid h-full grid-cols-12">
        <div className="hidden col-span-3 pr-2 lg:block">
          <CartContainer />
        </div>
        <div className="p-3 overflow-auto lg:col-span-9 col-span-full">
          <ContestPickerContainer />
          <ContestPickerCategoryContainer />
          <MatchPickerTableContainer />
        </div>
      </div>
    </LayoutContainer>
  );
};

export default IndexPage;

export const getServerSideProps: GetServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});
