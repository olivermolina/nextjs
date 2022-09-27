import React from 'react';
import ProfileContainer from '~/containers/Profile/ProfileContainer';
import LayoutContainer from '~/containers/LayoutContainer/LayoutContainer';
import { GetServerSideProps } from 'next';
import { supabase } from '~/utils/supabaseClient';
import { UrlPaths } from '~/constants/UrlPaths';

const Profile = () => {
  return (
    <LayoutContainer>
      <div className={'flex w-full'}>
        <ProfileContainer />
      </div>
    </LayoutContainer>
  );
};

export default Profile;

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
