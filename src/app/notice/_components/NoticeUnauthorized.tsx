'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import FitPage from '@/components/Layout/FitPage';
import { NotificationIcons } from '@/components/Notification/NotificationIcons';
import { ROUTE_PATH } from '@/constants/routePath';

interface NoticeUnauthorizedProps {
  redirectTo: { domain: 'noticeList' | 'noticeDetail'; withId?: number };
}

function NoticeUnauthorized({ redirectTo }: NoticeUnauthorizedProps) {
  const content = `
    공지사항을 보시려면
    로그인을 해주세요
  `;

  const redirectURL =
    redirectTo.domain === 'noticeList' ? ROUTE_PATH.NOTICE.LIST : ROUTE_PATH.NOTICE.DETAIL(redirectTo.withId ?? 1);

  return (
    <FitPage>
      <div className="box-border flex h-full w-full items-center justify-center p-4">
        <div className="box-border flex w-full flex-col items-center rounded-lg border-transparent bg-white px-4 py-8 drop-shadow-[0_-4px_4px_rgba(0,0,0,0.06)]">
          <div className="mb-2 text-4xl">
            <NotificationIcons.VeryDissatisfied />
          </div>
          <p
            className="mb-2 text-center"
            dangerouslySetInnerHTML={{
              __html: content.trim().replaceAll('\n', '<br />'),
            }}
          />
          <Link href={`/login?continueURL=${redirectURL}`} className="w-full">
            <Button bgColorTheme="orange" textColorTheme="white" fullWidth>
              로그인 하러가기
            </Button>
          </Link>
        </div>
      </div>
    </FitPage>
  );
}

export default NoticeUnauthorized;
