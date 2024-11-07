import React from 'react'
import Image from 'next/image'
// import LCLogo from '../../public/images/leetcode_light.png'
// import CFLogo from '../../public/images/codeforces.png'
// import CodeChefLogo from '../../public/images/codechef_light.png'

const ProfileSidebar = () => {
  return (
    <div className="grid gap-10">
      <div className="bg-white shadow-custom rounded-xl px-6 py-4 flex flex-col justify-center items-center">
        <div className="bg-orange-400 px-4 py-2 rounded-full w-fit text-white">
          <p className="font-semibold text-2xl">A</p>
        </div>
        <p>Aaditya Padte</p>
        <p>India,Mumbai</p>
        <div>
        <div className="flex gap-4 items-center mt-2">
          <Image
            src={"/svgs/lc.svg"}
            width={0}
            height={0}
            className="w-6 h-6"
            alt="abcd"
          />
          <p>Rating:- 2144</p>
        </div>
        <div className="flex gap-4 items-center mt-2">
          <Image
            src={"/svgs/cf.svg"}
            width={0}
            height={0}
            className="w-6 h-6"
            alt="abcd"
          />
          <p>Rating:- 1400</p>
        </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSidebar
