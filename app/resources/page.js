"use client";
import React, { useState } from "react";
import { ExternalLink, BookOpen, Code, Trophy, Target } from "lucide-react";
const Resources = () => {

  const platforms = [
    {
      name: "Codeforces",
      url: "https://codeforces.com/",
      logo: {
        src: "https://sta.codeforces.com/s/44094/favicon-32x32.png",
        alt: "Codeforces logo"
      }
    },
    {
      name: "LeetCode",
      url: "https://leetcode.com/",
      logo: {
        src: "https://leetcode.com/static/images/LeetCode_logo.png",
        alt: "LeetCode logo"
      }
    },
    {
      name: "CodeChef", 
      url: "https://www.codechef.com/",
      logo: {
        src: "https://www.codechef.com/favicon.ico",
        alt: "CC logo"
      }
    },
    {
      name: "AtCoder",
      url: "https://atcoder.jp/home",
      logo: { 
        src: "https://atcoder.jp/favicon.ico", 
        alt: "AtCoder logo" 
      }
    },
    {
      name: "CSES",
      url: "https://cses.fi/register/",
      logo: {
        src: "/images/cses.png",
        alt: "CSES logo"
      }
    },
    {
      name: "HackerRank",
      url: "https://www.hackerrank.com/auth/login",
      logo: {
        src: "https://cdn.prod.website-files.com/66b6d7fd4d3e9cef94717176/6715d41d809c171b16ea5612_Hackerrank%20Cursor%20Favicon.png",
        alt: "HackerRank logo"
      }
    }
  ];


  const contests = [
    {
      level: "For Beginners",
      list: [
        "Codechef starters (every Wednesday)",
        "Codeforces Div 3, Div 4"
      ]
    },
    {
      level: "Intermediate & Advanced",
      list: [
        "Codeforces (all Divisions)",
        "Codechef starters",
        "LeetCode Weekly and Biweekly"
      ]
    }
  ];

  const practiceResources = [
    {
      title: "Rating-Wise Practice",
      resources: [
        { name: "CP31 Sheet", url: "https://www.tle-eliminators.com/cp-sheet", desc: "Structured practice sheet,good for beginners " },
        { name: "Codeforces Problemset", url: "https://codeforces.com/problemset", desc: "Filter by difficulty" },
      ]
    },
    {
      title: "Topic-Wise Practice",
      resources: [
        { name: "CSES Problemset", url: "https://cses.fi/problemset/", desc: "A good collection of advanced problems" },
        { name: "Codeforces Problemset", url: "https://codeforces.com/problemset", desc: "Filter based on topic" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Competitive Programming Resources</h1>
          <p className="text-gray-600 text-lg">Your complete roadmap to mastering CP</p>
        </div>
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="text-blue-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">Featured Playlist</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 items-start">
            <a
              href="https://youtube.com/playlist?list=PLauivoElc3ggagradg8MfOZreCMmXMmJ-&si=z6Klj-Mts4nEgX4o"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
            >
              <div className="relative pb-[56.25%] overflow-hidden rounded">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/videoseries?list=PLauivoElc3ggagradg8MfOZreCMmXMmJ-"
                  title="A very good playlist to learn the basics and start"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                    A very good playlist to learn the basics and start
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Great starting point to learn fundamentals and begin solving problems.</p>
                </div>
                <ExternalLink className="text-gray-400 group-hover:text-blue-600 transition-colors" size={18} />
              </div>
            </a>

            <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
              <h4 className="font-semibold text-gray-800 mb-2">How to use this playlist</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>Watch videos in order to build a strong foundation.</li>
                <li>Pause and solve example problems alongside the videos.</li>
                <li>Repeat concepts you find difficult and practice related problems afterwards.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Practice Resources */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Target className="text-blue-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">Practice Resources</h2>
          </div>

          {practiceResources.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">{section.title}</h3>
              <div className="grid gap-3">
                {section.resources.map((resource, resourceIdx) => (
                  <a
                    key={resourceIdx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                          {resource.name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">{resource.desc}</p>
                      </div>
                      <ExternalLink className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" size={18} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-amber-50 rounded-lg border border-amber-200 p-5 mt-6">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-gray-800">Note:</span> Both topic-wise and rating-wise practice are needed.
              When you study a topic, practice topic-wise problems to strengthen it. Alongside, keep practicing random
              rating-wise problems in general.
            </p>
          </div>
        </section>

        {/* Coding Platforms */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Code className="text-blue-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">Coding Platforms</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {platforms.map((platform, idx) => (
              <a
                key={idx}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {platform.logo?.src && (
                      <img
                        src={platform.logo.src}
                        alt={platform.logo.alt || platform.name}
                        className="w-10 h-10 rounded-md object-contain"
                        loading="lazy"
                      />
                    )}
                    <h3 className="font-semibold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                      {platform.name}
                    </h3>
                  </div>
                  <ExternalLink className="text-gray-400 group-hover:text-blue-600 transition-colors" size={18} />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Contest Strategy */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="text-blue-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">Contest Strategy</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {contests.map((contest, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200"
              >
                <h3 className="font-semibold text-gray-800 mb-3">{contest.level}</h3>
                <ul className="space-y-2">
                  {contest.list.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-gray-600 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-lg border border-blue-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Contest Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>Be consistent and don't miss any contests</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>Upsolve at least 1-2 problems after each contest</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>Analyze the contest and note down silly mistakes to avoid repeating them</span>
              </li>
            </ul>
          </div>
        </section>

        {/* How to Proceed */}
        <section>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">How to Proceed</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-2xl font-bold">1</span>
                <span>Start studying the topics and keep practicing problems alongside</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl font-bold">2</span>
                <span>You can start giving contests after learning the basics. Just be consistent and have patience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl font-bold">3</span>
                <span>When you study a topic, practice lots of problems on it before proceeding to the next</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl font-bold">4</span>
                <span>When stuck on a problem, try to debug yourself first. If unable, look at editorials or ask for help</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resources;