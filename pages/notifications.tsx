import Header from "@/components/Header";
import NotificationsFeed from "@/components/NotificationsFeed";

import useCurrentUser from "@/hooks/useCurrentUser";
import { NextPageContext, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {
      session
    }
  }
}

const Notifications = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Header showBackArrow label="Notifications" />
      <NotificationsFeed />
    </>
   );
}

export default Notifications;
