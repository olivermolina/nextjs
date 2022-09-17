import { NextPageWithLayout } from '../_app';
import CartContainer from '~/containers/Cart';
import ContestPickerContainer from '~/containers/ContestContainer/ContestPickerContainer';
import MatchPickerTableContainer from '~/containers/MatchPickerTableContainer/MatchPickerTableContainer';
import { supabase } from '~/utils/supabaseClient';
import { GetServerSideProps } from 'next';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import { UrlPaths } from '~/constants/UrlPaths';

const IndexPage: NextPageWithLayout = () => {
  return (
    <LayoutContainer>
      <div className="grid h-full grid-cols-12">
        <div className="hidden col-span-3 pr-2 lg:block">
          <CartContainer />
        </div>
        <div className="p-3 overflow-auto lg:col-span-9 col-span-full">
          <ContestPickerContainer />
          <MatchPickerTableContainer />
        </div>
      </div>
    </LayoutContainer>
  );
};

export default IndexPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await supabase.auth.api.getUserByCookie(ctx.req, ctx.res);
  if (!user.user) {
    return {
      redirect: {
        permanent: false,
        destination: UrlPaths.Login,
      },
    };
  }
  return {
    props: {},
  };
};
