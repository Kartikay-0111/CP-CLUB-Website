'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import axios from "axios"
import dayjs from "dayjs"
import Link from "next/link"
import Image from "next/image"

const platformLogos = {
  codeforces: "https://upload.wikimedia.org/wikipedia/en/3/38/Codeforces%27s_new_logo.png",
  leetcode: "https://upload.wikimedia.org/wikipedia/commons/0/0a/LeetCode_Logo_black_with_text.svg",
  codechef: "https://upload.wikimedia.org/wikipedia/en/7/7b/Codechef%28new%29_logo.svg",
  atcoder: "https://img.atcoder.jp/logo/atcoder/logo.png",
  geeksforgeeks: "https://upload.wikimedia.org/wikipedia/commons/4/43/GeeksforGeeks.svg"
}

export default function Component() {
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [contests, setContests] = useState({ previous: [], upcoming: [] })

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const startDate = dayjs().subtract(3, 'months').startOf('day').toISOString()
        const endDate = dayjs().add(3, 'months').endOf('day').toISOString()
  
        const response = await axios.get("https://node.codolio.com/api/contest-calendar/v1/all/get-contests", {
          params: { startDate, endDate }
        })
  
        const allContests = response.data.data
          .filter(event => event.platform !== 'geeksforgeeks')
          .sort((a, b) => new Date(a.contestStartDate) - new Date(b.contestStartDate))
        
        const now = dayjs()
        const previousContests = allContests
        .filter(contest => dayjs(contest.contestStartDate).isBefore(now))
        .sort((a, b) => new Date(b.contestStartDate) - new Date(a.contestStartDate))
        const upcomingContests = allContests.filter(contest => dayjs(contest.contestStartDate).isAfter(now))
  
        setContests({ previous: previousContests, upcoming: upcomingContests })
      } catch (error) {
        console.error("Error fetching contests:", error)
      }
    }
  
    fetchContests()
  }, [])

  const previousMonth = () => setCurrentDate(currentDate.subtract(1, 'month'))
  const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'))
  const daysInMonth = Array.from({ length: currentDate.daysInMonth() }, (_, i) => i + 1)
  const startDayOfWeek = currentDate.startOf('month').day()

  const eventsByDate = [...contests.previous, ...contests.upcoming].reduce((acc, event) => {
    const eventDate = dayjs(event.contestStartDate).format('YYYY-MM-DD')
    if (!acc[eventDate]) acc[eventDate] = []
    acc[eventDate].push(event)
    return acc
  }, {})

  const formatContestName = (contestName) => {
    return contestName
      .replace(/%20/g, '-')     
      .replace(/\s+/g, '-')      
      .toLowerCase();          
  };

  const ContestList = ({ contests }) => (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
      {contests.map((event, index) => (
        <Card key={index} className="p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start gap-3">
            <Image
              src={platformLogos[event.platform]}
              alt={event.platform}
              width={24}
              height={24}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="text-sm text-gray-500">
                {dayjs(event.contestStartDate).format("MMM D, YYYY HH:mm")} - 
                {dayjs(event.contestStartDate).add(event.contestDuration, 'second').format("HH:mm")}
              </div>
              <div className="font-medium mt-1 flex items-center">
                <span className="text-blue-600 font-semibold bg-blue-100 px-2 py-0.5 rounded-full mr-2 text-xs">
                  {event.platform.charAt(0).toUpperCase() + event.platform.slice(1)}
                </span>
                {event.contestName}
                <Link href={event.contestUrl} passHref target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 text-gray-400 ml-2" />
                </Link>
                {(event.platform === 'leetcode' || event.platform === 'codeforces') && dayjs(event.contestStartDate).isBefore(dayjs()) && (
                  <Link
                  href={`/pastcontest?contestId=${event.contestCode}&contestName=${encodeURIComponent(formatContestName(event.contestName))}&platform=leetcode`}
                  passHref
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="ml-2">
                    View Leaderboard
                  </Button>
                </Link> 
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8">
        <div className="space-y-6">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming Contests</TabsTrigger>
              <TabsTrigger value="previous">Previous Contests</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upcoming Contests</h2>
              <ContestList contests={contests.upcoming} />
            </TabsContent>
            <TabsContent value="previous" className="mt-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Previous Contests</h2>
              <ContestList contests={contests.previous} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="border rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{currentDate.format("MMMM YYYY")}</h2>
            <div className="flex gap-2">
              <Button onClick={previousMonth} variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button onClick={nextMonth} variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-sm font-medium text-gray-500 text-center">
                {day}
              </div>
            ))}

            {Array.from({ length: startDayOfWeek }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {daysInMonth.map((day) => {
              const dateStr = currentDate.year() + '-' + (currentDate.month() + 1).toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0')
              const events = eventsByDate[dateStr]

              return (
                <div
                  key={day}
                  className={`aspect-square p-1 border rounded-lg hover:bg-gray-50 transition-colors ${
                    events ? 'bg-blue-100' : ''
                  } ${currentDate.date() === day ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="text-sm text-gray-600">{day}</div>
                  {events && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {events.map((event, i) => (
                        <Link key={i} href={event.contestUrl} target="_blank" rel="noopener noreferrer">
                          <Image
                            src={platformLogos[event.platform]}
                            alt={event.platform}
                            width={16}
                            height={16}
                            className="rounded-full"
                          />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}