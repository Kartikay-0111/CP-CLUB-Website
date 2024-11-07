import Profile from '@/components/Profile/Profile'
import { getLeetCodeData } from '@/lib/getLeetCodeData'
import React from 'react'
import members from '@/json/members.json'
import { getCodeForcesData } from '@/lib/getCodeForcesData';

async function page({params}) {
  const key = (await params).username;
  const user_data = members[key];
  
  const leetCodeData = await getLeetCodeData(user_data.lc_username);
  const codeForcesData = await getCodeForcesData(user_data.cf_username);

  console.log(leetCodeData);
  console.log(codeForcesData);
  
  return (
    <div>
      <Profile />
    </div>
  );
}

export default page