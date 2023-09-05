'use client';

import { useLayoutEffect, useState } from 'react';
import { getProfile } from '@/service/user';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { HttpStatusCode, type AxiosError } from 'axios';
import Button from '../Button/Button';
import { ErrorNotification } from '../Notification';
import { subscribe } from '@/service/subscribe';
import { type APIResponse } from '@/interfaces/Dto/Core';

interface SubscribeButtonProps {
  subscribeRedirectURL?: string;
}

function SubscribeButtonLoading() {
  return (
    <div className="skeleton_loading">
      <Button bgColorTheme="orange" textColorTheme="white" fullWidth>
        {' '}
      </Button>
    </div>
  );
}

function SubscribeButton({ subscribeRedirectURL }: SubscribeButtonProps) {
  const { push, refresh } = useRouter();

  const {
    data: membership,
    status,
    error,
  } = useQuery(['profile'], () => getProfile(), {
    refetchOnWindowFocus: false,
    retry: 0,
    select: (response) => response.data.data?.membership,
  });

  const [isGuest, setIsGuest] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const RenderSubscribeButton = () => {
    switch (membership) {
      case 'BASIC':
        return (
          <Button
            bgColorTheme="orange"
            textColorTheme="white"
            fullWidth
            onClick={async () => {
              const { data: response, status } = await subscribe({
                url: subscribeRedirectURL || `${process.env.NEXT_PUBLIC_SITE_URL}/payment`,
              });

              if (status === HttpStatusCode.Ok) {
                push(response.data!.payment);
              }
            }}
          >
            구독하기
          </Button>
        );
      case 'PREMIUM':
        return (
          <Button
            className="disabled:!bg-[#898A8D]"
            disabled={true}
            bgColorTheme="orange"
            textColorTheme="white"
            fullWidth
          >
            구독중
          </Button>
        );
      default:
        return (
          <Button
            bgColorTheme="orange"
            textColorTheme="white"
            fullWidth
            onClick={() => {
              if (isGuest) {
                setShowNotification(true);
              }
            }}
          >
            구독하기
          </Button>
        );
    }
  };

  useLayoutEffect(() => {
    if (status === 'success' && !error) {
      setIsGuest(false);

      return;
    }

    if (status === 'error') {
      const errorPayload = (error as AxiosError<APIResponse>).response?.data;

      if (errorPayload?.status === 401) {
        setIsGuest(true);
      }

      return;
    }
  }, [status]); /* eslint-disable-line */

  if (status === 'loading') return <SubscribeButtonLoading />;

  return (
    <>
      {RenderSubscribeButton()}
      <ErrorNotification
        content={`
          로그인 후
          이용가능합니다.
        `}
        buttonText={'로그인'}
        linkURL={'/login?continueURL=/mypage/membership'}
        closeOnClick
        active={showNotification}
        onClose={() => {
          setShowNotification(false);
        }}
      />
    </>
  );
}

export default SubscribeButton;
