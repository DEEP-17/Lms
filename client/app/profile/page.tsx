'use client'
import Protected from '@/app/hooks/useProtected'
import { useRouter } from 'next/navigation'
import React, { FC, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Header from '../components/Header'
import Profile from '../components/Profile/Profile'
import Heading from '../utils/Heading'
import { useLoadUserQuery } from '@/redux/features/api/apiSlice'
import Loader from '../components/Loader/Loader'

const page: FC = () => {
  const [open, setOpen] = React.useState(false);
  const [activeItem] = React.useState(-1);
  const [route, setRoute] = React.useState("Login");
  const { user } = useSelector((state: any) => state.auth);
  const { data: userData , isLoading } = useLoadUserQuery(undefined);
  const router = useRouter();

  useEffect(() => {
    if (!userData && !user && !isLoading) return router.push('/');
  }, [userData,router]);

  if (isLoading) return <Loader/>
  return (
    <div>
      <Protected>
        <Heading
          title={`${user?.name}'s profile - ELearning`}
          description="Elearning is a platform for students to learning and get help from teachers"
          keywords="Programming, JavaScript, React, Next.js, Elearning, Education, Online Learning"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <Profile user={user?user:userData} />
      </Protected>
    </div>
  )
}

export default page
