import React from 'react';
import Icons from '~/components/Icons/Icons';

const CopyButton = (props: React.ComponentPropsWithoutRef<'button'>) => (
  <button {...props}>
    <Icons.ClipboardDocument className={'h-6 w-6'} />
  </button>
);

export interface ReferralProps {
  /**
   * Referral Code
   */
  referralCode: string;
}

const Referral = ({ referralCode }: ReferralProps) => {
  const referralLink = `${window.location.origin}/auth/sign-up?referral=${referralCode}`;
  return (
    <div className={`w-full lg:p-4`}>
      <div className="flex flex-col p-6 gap-2 rounded-lg shadow-md p-4 gap-4">
        <p className="font-bold text-lg">Referral</p>
        <div className={`flex flex-col justify-between gap-4`}>
          <div className={`flex justify-between p-2 bg-gray-100 rounded-lg`}>
            <p>Referral Code</p>
            <div className={'flex items-center gap-2'}>
              <p>{referralCode}</p>
              <CopyButton
                onClick={() => navigator.clipboard.writeText(referralCode)}
              />
            </div>
          </div>
          <div className={`flex justify-between p-2 bg-gray-100 rounded-lg`}>
            <p>Referral Link</p>
            <div className={'flex gap-2 justify-items-end'}>
              <p>{referralLink}</p>
              <CopyButton
                onClick={() => navigator.clipboard.writeText(referralLink)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referral;
