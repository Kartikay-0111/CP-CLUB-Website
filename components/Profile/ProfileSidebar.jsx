import React from "react";
import Image from "next/image";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
// import LCLogo from '../../public/images/leetcode_light.png'
// import CFLogo from '../../public/images/codeforces.png'
// import CodeChefLogo from '../../public/images/codechef_light.png'

const ProfileSidebar = () => {
  const ratingData = [
    {
      image: "/svgs/cf.svg",
      rating: "1400",
    },
    {
      image: "/svgs/lc.svg",
      rating: "2144",
    },
    {
      image: "/svgs/cc.svg",
      rating: "1400",
    },
  ];
  const platformsData = [
    {
      image: "/svgs/cf.svg",
      platform: "Codeforces",
      username: "aaditya8c",
      link: "https://codeforces.com/profile/hewhocodes",
    },
    {
      image: "/svgs/lc.svg",
      platform: "Leetcode",
      username: "aaditya8c",
      link: "https://codeforces.com/profile/hewhocodes",
    },
    {
      image: "/svgs/cc.svg",
      platform: "Codeforces",
      username: "aaditya8c",
      link: "https://codeforces.com/profile/hewhocodes",
    },
  ];
  return (
    <div className="grid gap-6">
      <div className="bg-white shadow-custom rounded-xl px-6 py-4 flex flex-col justify-center items-center">
        <div className="bg-orange-400 px-4 py-2 rounded-full w-fit text-white">
          <p className="font-semibold text-2xl">A</p>
        </div>
        <p>Aaditya Padte</p>
        <p>India,Mumbai</p>
        <div className="shadow-lg py-3 px-6 bg-slate-100 my-4 rounded-md">
          {ratingData.map((item, index) => {
            return (
              <div key={index} className="flex gap-4 items-center mt-2">
                <Image
                  src={item.image}
                  width={0}
                  height={0}
                  className="w-5 h-5"
                  alt="abcd"
                />
                Rating:<p className="text-sm font-semibold">{item.rating} </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white shadow-custom rounded-xl px-4 py-4 flex flex-col justify-center">
        <p>Visit your Coding Platforms</p>
        <div className="grid gap-4">
          <div className="my-4 flex flex-col gap-2 px-4">
            {platformsData.map((item, index) => {
              return (
                <Link
                  href={item.link}
                  target="_blank"
                  key={index}
                  className="flex gap-4 justify-between items-center bg-gray-50 p-2 hover:bg-gray-100 transition-all duration-200 cursor-pointer rounded-md"
                >
                  <div className="flex gap-4 items-center">
                    <Image
                      src={item.image}
                      width={0}
                      height={0}
                      className="w-6 h-6"
                      alt="abcd"
                    />
                    <span className="text-sm">
                      <p>{item.platform}</p>
                      <p>{item.username}</p>
                    </span>
                  </div>
                  <SquareArrowOutUpRight />
                </Link>
              );
            })}
            {/* <div className="flex gap-4 items-center">
              <Image
                src={"/svgs/lc.svg"}
                width={0}
                height={0}
                className="w-6 h-6"
                alt="abcd"
              />
              <span>
                <p>Codeforces</p>
                <p>Username</p>
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
