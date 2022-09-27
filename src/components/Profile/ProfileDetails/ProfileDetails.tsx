import React from 'react';
import { Button } from '~/components/Button';
import { EditIcon } from '~/components/Icons';
import { AvatarCircle } from '~/components';

interface ProfileDetailsProps {
  /**
   * User profile image
   */
  image: string;
  /**
   * Username
   */
  username: string;
  /**
   * Number of followers
   */
  followers: number;
  /**
   * Number of following
   */
  following: number;
  isLoading: boolean;
}

const ProfileDetails = (props: ProfileDetailsProps) => {
  return (
    <div className={`w-full lg:p-4`}>
      <div
        className={`flex flex-row justify-between rounded-b-lg shadow-md p-4 bg-gradient-to-r from-white to-gray-400 gap-2`}
      >
        <div className="flex flex-col justify-around gap-2">
          {props.isLoading ? (
            <div className="rounded-full h-[50px] w-[50px] bg-gray-200" />
          ) : (
            <AvatarCircle imgSrc={props.image} height={50} width={50} />
          )}
          <p className="font-bold">
            {' '}
            @{props.isLoading ? '' : props.username}{' '}
          </p>
          <p> A valued lockspread user. </p>
          <div className="flex flex-row gap-2 items-center">
            <div className="flex flex-col-reverse md:flex-row md:items-center gap-2">
              <Button variant="primary" width={'auto px-2'}>
                <p className="text-sm">{props.following}</p>
              </Button>
              <p> Following </p>
            </div>

            <div className="flex flex-col-reverse md:flex-row md:items-center gap-2">
              <Button variant="primary" width={'auto px-2'}>
                <p className="text-sm">{props.followers}</p>
              </Button>
              <p>Followers</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between items-end">
          <button
            className="py-2.5 px-3 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700"
            type="button"
          >
            <EditIcon className="h-6 w-6" />
          </button>
          <Button variant="primary">
            <p>Follow</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
