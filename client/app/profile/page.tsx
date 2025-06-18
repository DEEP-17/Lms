'use client'
import Protected from '@/app/hooks/useProtected'
import React, { FC } from 'react'
import Header from '../components/Header'
import Heading from '../utils/Heading'
import { useSelector } from 'react-redux'
import Profile from '../components/Profile/Profile'
type Props = {}
const page: FC<Props> = (props) => {
  const [open, setOpen] = React.useState(false);
  const [activeItem] = React.useState(0);
  const [route, setRoute] = React.useState("Login");
  const { user } = useSelector((state: any) => state.auth);
  return (
    <div>
      <Protected>
        <Heading
          title={`${user?.name}`}
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
        <Profile user={user} />
      </Protected>
    </div>
  )
}

export default page
