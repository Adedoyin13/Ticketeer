import React from 'react'
import Header from '../Reusables/Header';
import UserFooter from '../Reusables/UserFooter';

const UserLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className='min-h-[80vh]'>{children}</div>
      <UserFooter/>
    </>
  )
}

export default UserLayout;