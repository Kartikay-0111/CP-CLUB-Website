import Profile from '@/components/Profile/Profile'
import { getLeetCodeData } from '@/lib/getLeetCodeData'
import React from 'react'

async function page({params}) {
  const username = (await params).username;
  const leetCodeData = await getLeetCodeData(username);
  console.log(leetCodeData);

  return (
    <div>
      <Profile />
    </div>
  );
}

export default page