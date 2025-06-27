'use client'
import Protected from '@/app/hooks/useProtected'
import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import Header from '../components/Header'
import Profile from '../components/Profile/Profile'
import Heading from '../utils/Heading'
type Props = {}
const page: FC<Props> = (props) => {
  const [open, setOpen] = React.useState(false);
  const [activeItem] = React.useState(5);
  const [route, setRoute] = React.useState("Login");
  const { user } = useSelector((state: any) => state.auth);
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
          activeItem={-1}
          setRoute={setRoute}
          route={route}
        />
        <Profile user={user} />
      </Protected>
    </div>
  )
}

export default page
