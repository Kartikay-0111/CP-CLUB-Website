import React from "react";
import Image from "next/image";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

const ProfileSidebar = () => {
  const ratingData = [
    {
      image: "/svgs/cf.svg",
      platform: "Codeforces",
      rating: "1400",
    },
    {
      image: "/svgs/lc.svg",
      platform: "Leetcode",
      rating: "2144",
    },
    {
      image: "/svgs/cc.svg",
      platform: "Codechef",
      rating: "1400",
    },
  ];
  const platformsData = [
    {
      image: "/svgs/cf.svg",
      platform: "Codeforces",
      username: "hewhocodes",
      link: "https://codeforces.com/profile/",
    },
    {
      image: "/svgs/lc.svg",
      platform: "Leetcode",
      username: "hewhocodes",
      link: "https://leetcode.com/u/",
    },
    {
      image: "/svgs/cc.svg",
      platform: "Codeforces",
      username: "hewhocodes",
      link: "https://www.codechef.com/users/",
    },
  ];
  return (
    <div className="grid gap-4">
      {/* User Details */}
      <div className="bg-white shadow-custom rounded-xl px-6 py-4 flex flex-col justify-center items-center">
        <div className="bg-orange-400 px-4 py-2 rounded-full w-fit text-white">
          <p className="font-semibold text-2xl">A</p>
        </div>
        <p>Aaditya Padte</p>
        <p>India,Mumbai</p>
        <p className="font-semibold pt-2">Contest Rankings</p>
        <div className="border-t-2 w-full my-2" />
        <div className="shadow-xl py-3 w-[80%] px-6 bg-slate-50 my-2 rounded-md">
          {ratingData.map((item, index) => {
            return (
              <div key={index} className="py-4 grid ">
                <p className="text-center text-sm">{item.platform}</p>
                <div className="flex justify-evenly items-center py-2">
                  <Image
                    src={item.image}
                    width={0}
                    height={0}
                    className="w-5 h-5"
                    alt="abcd"
                  />
                  <p className="text-sm font-semibold animate-pulse">
                    {item.rating}{" "}
                  </p>
                </div>
                <div className="border-t-2 w-full" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Coding Profiles */}
      <div className="bg-white shadow-custom rounded-xl px-4 py-4 flex flex-col justify-center">
        <p className="font-semibold px-1">Visit your Coding Platforms</p>
        <div className="grid gap-4">
          <div className="my-4 flex flex-col gap-2 px-4">
            {platformsData.map((item, index) => {
              return (
                <Link
                  href={`${item.link}/${item.username}`}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
