import Link from 'next/link';
import React from 'react';
import { Logo } from '~/components/Layout/Logo';
import { SocialLinks } from '~/components/SocialLinks/SocialLinks';
import { UnderlinedLink } from '~/components/Nav/UnderlinedLink';
import LandingHeader from './Header';

type Props = {
  children: any;
};

const LandingLayout = (props: Props) => {
  return (
    <div className="flex bg-wave-img text-white flex flex-col bg-auto min-h-screen">
      {/* Header */}
      <LandingHeader />

      {/* Body */}
      <div className="flex-grow justify-center items-center">
        {props.children}
      </div>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row px-10 py-4 border-t border-gray-400 items-center gap-1 md:gap-5 place-content-between">
        <div className="flex gap-1 md:gap-6 items-center justify-between">
          <Logo scale={4} />
          <UnderlinedLink>
            <Link
              href="/legal/responsiblegaming.pdf"
              className="text-xs md:text-base"
            >
              Responsible Gaming
            </Link>
          </UnderlinedLink>
          <UnderlinedLink>
            <Link href="/legal/terms.pdf" className="text-xs md:text-base">
              Terms and conditions
            </Link>
          </UnderlinedLink>
          <UnderlinedLink>
            <Link
              href="/legal/privacypolicy.pdf"
              className="text-xs md:text-base"
            >
              Privacy policy
            </Link>
          </UnderlinedLink>
          <UnderlinedLink>
            <Link
              href="legal/contestrules.pdf"
              className="text-xs md:text-base"
            >
              Contest rules
            </Link>
          </UnderlinedLink>
        </div>
        <div className="flex flex-col items-center gap-4">
          <span className="text-sm font-bold text-gray-200">
            Follow us on social media
          </span>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
