import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import LandingLayout from '~/components/LandingLayout';
import { UrlPaths } from '~/constants/UrlPaths';
import { supabase } from '~/utils/supabaseClient';
import { trpc } from '~/utils/trpc';
import { FormErrorText } from '~/components/Form/FormErrorText';
import { useRouter } from 'next/router';
import { TRPCClientError } from '@trpc/client';
import BackdropLoading from '~/components/BackdropLoading';
import ChangeRouteLoadingContainer from '~/containers/ChangeRouteLoadingContainer/ChangeRouteLoadingContainer';

type Inputs = {
  email: string;
  password: string;
};

const defaultClasses =
  'rounded-full text-2xl bg-gray-200 font-bold text-gray-500 p-4 w-full';

const Create = () => {
  const router = useRouter();
  const mutation = trpc.user.login.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await mutation.mutateAsync(data);
      router.push(UrlPaths.Challenge);
    } catch (error) {
      const e = error as TRPCClientError<any>;
      toast.error(e.message);
    }
  };
  return (
    <LandingLayout>
      <ChangeRouteLoadingContainer />
      <BackdropLoading open={mutation.isLoading} />
      <div className="flex p-4 justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-4xl grid grid-cols-1 gap-4 p-8 w-full rounded-2xl bg-white text-black overflow-y-auto"
        >
          <h2 className="font-bold mb-4 text-center text-4xl">
            Please fill all the details
          </h2>
          <input
            type="email"
            placeholder="email"
            style={{
              maxHeight: 64,
            }}
            className={classNames(defaultClasses)}
            {...register('email', { required: true })}
          />
          <FormErrorText>{errors.email?.message}</FormErrorText>
          <input
            type="password"
            placeholder="password"
            style={{
              maxHeight: 64,
            }}
            className={classNames(defaultClasses)}
            {...register('password', {})}
          />
          <FormErrorText>{errors.password?.message}</FormErrorText>
          <button
            style={{
              maxHeight: 64,
            }}
            className="p-4 capitalize text-white rounded-full font-bold text-2xl bg-blue-600"
            type="submit"
          >
            submit
          </button>
        </form>
      </div>
    </LandingLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await supabase.auth.api.getUserByCookie(ctx.req, ctx.res);
  if (user.user) {
    return {
      redirect: {
        permanent: false,
        destination: UrlPaths.Challenge,
      },
    };
  }
  return {
    props: {},
  };
};

export default Create;
