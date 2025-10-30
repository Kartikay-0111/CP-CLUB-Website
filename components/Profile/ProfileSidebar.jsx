import React from "react";
import Image from "next/image";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

const ProfileSidebar = ({ data }) => {
  const ratingData = [
    {
      image: "/svgs/cf.svg",
      platform: "Codeforces",
      rating: data.codeForcesData?.rating ?? 0,
    },
    {
      image: "/svgs/lc.svg",
      platform: "Leetcode",
      rating: data.leetCodeData?.userContestDetails?.rating?.toFixed(0) ?? 0,
    },
    // {
    //   image: "/svgs/cc.svg",
    //   platform: "Codechef",
    //   rating: "1400",
    // },
  ];
  const platformsData = [
    {
      image: "/svgs/cf.svg",
      platform: "Codeforces",
      username: data.user_data.cf_username,
      link: "https://codeforces.com/profile",
    },
    {
      image: "/svgs/lc.svg",
      platform: "Leetcode",
      username: data.user_data.lc_username,
      link: "https://leetcode.com/u",
    },
    {
      image: "/svgs/cc.svg",
      platform: "Codechef",
      username: data.user_data.cc_username,
      link: "https://www.codechef.com/users",
    },
  ];
  return (
    <div className="grid gap-4">
      {/* User Details */}
      <div className="bg-white shadow-custom rounded-xl px-6 py-4 gap-3 flex flex-col justify-center items-center">
        {data.codeForcesData?.avatar ? (
          <Image
            width={112}
            height={112}
            src={data.codeForcesData?.titlePhoto}
            alt=""
            className="w-28 h-28 rounded-full"
          />
        ) : (
          <div className="bg-orange-400 px-4 py-2 rounded-full w-28 h-28 text-white flex justify-center items-center">
            <p className="font-semibold text-4xl">A</p>
          </div>
        )}
        <div className="text-center">
          <p className="text-xl font-bold">{data.user_data?.name}</p>
          <p className="text-sm text-slate-500">Mumbai, India</p>
        </div>
        <p className="pt-2">Contest Rankings</p>
        <div className="w-full">
          {ratingData.map((item, index) => {
            return (
              <div key={index} className="py-3 grid border-t-2">
                <p className="text-center text-sm">{item.platform}</p>
                <div className="flex justify-evenly items-center py-2">
                  <Image
                    src={item.image}
                    width={0}
                    height={0}
                    className="w-8 h-8"
                    alt="abcd"
                  />
                  <p className="text-lg font-semibold animate-pulse">
                    {item.rating}{" "}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coding Profiles */}
      <div className="bg-white shadow-custom rounded-xl px-4 py-4 flex flex-col justify-center h-full">
        <p className="font-semibold px-1">Visit your Coding Platforms</p>
        <div className="grid gap-4">
          <div className="my-4 flex flex-col gap-2 px-4">
            {platformsData.map((item, index) => {
              return (
                <Link
                  href={`${item.link}/${item.username}`}
                  target="_blank"
                  key={index}
                  className="flex gap-4 justify-between items-center bg-[#F5F6FE] p-2 hover:bg-gray-100 transition-all duration-200 cursor-pointer rounded-md"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
