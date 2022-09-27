import React from 'react';
import { Logo } from '~/components/Layout/Logo';
import { SocialLinks } from '~/components/SocialLinks/SocialLinks';
import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();
  return (
    <nav className="flex px-5 md:px-10 items-center justify-between sticky top-0 z-50 bg-wave-img">
      <Logo />
      <div className="flex items-center gap-4 lg:gap-10">
        <div className={'hidden md:block'}>
          <SocialLinks />
        </div>

        <div className="flex gap-4  items-center justify-between">
          {router?.pathname !== '/auth/sign-up' && (
            <button
              type="submit"
              className="p-4 px-auto lg:px-20 rounded-full font-bold text-xl bg-white text-blue-600 w-max max-h-[80px]"
              onClick={() => router.push('/auth/sign-up')}
            >
              Sign Up
            </button>
          )}
          {router?.pathname !== '/auth/login' && (
            <button
              type="submit"
              className="p-4 px-auto lg:px-20 text-white rounded-full bg-transparent hover:bg-blue-500 font-bold text-xl bg-blue-600 border border-white max-h-[80px]"
              onClick={() => router.push('/auth/login')}
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
