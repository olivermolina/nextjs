import React from 'react';
import { Logo } from '~/components/Layout/Logo';
import { SocialLinks } from '~/components/SocialLinks/SocialLinks';
import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();
  return (
    <nav className="flex px-5 md:px-10items-center justify-between">
      <Logo />
      <div className="flex items-center gap-10">
        <div className={'hidden md:block'}>
          <SocialLinks />
        </div>

        <div className="flex gap-4">
          {router?.pathname !== '/auth/sign-up' && (
            <button
              type="submit"
              className="p-4 px-8 md:px-20 rounded-full font-bold text-m bg-white text-blue-600 w-max"
              onClick={() => router.push('/auth/sign-up')}
            >
              Sign Up
            </button>
          )}
          {router?.pathname !== '/auth/login' && (
            <button
              type="submit"
              className="p-4 px-8 md:px-20 text-white rounded-full bg-transparent hover:bg-blue-500 font-bold text-xl bg-blue-600 border border-white"
              onClick={() => router.push('/auth/login')}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
