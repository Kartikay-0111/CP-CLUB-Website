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

  let data = {
    user_data:user_data,
    leetCodeData: leetCodeData ?? null,
    codeForcesData: codeForcesData ?? null
  }

  
  return (
    <div>
      <Profile data={data} />
    </div>
  );
}

export default page