'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Calendar, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
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
  const [upcomingEvents, setUpcomingEvents] = useState([])

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const startDate = dayjs().startOf('month').toISOString();
        const endDate = dayjs().add(2, 'months').startOf('month').toISOString();
  
        const response = await axios.get("https://node.codolio.com/api/contest-calendar/v1/all/get-contests", {
          params: { startDate, endDate }
        });
  
        const filteredContests = response.data.data
          .filter(event => event.platform !== 'geeksforgeeks')
          .sort((a, b) => new Date(a.contestStartDate) - new Date(b.contestStartDate));
  
        setUpcomingEvents(filteredContests);
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };
  
    fetchContests();
  }, []);
  

  const previousMonth = () => setCurrentDate(currentDate.subtract(1, 'month'))
  const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'))
  const daysInMonth = Array.from({ length: currentDate.daysInMonth() }, (_, i) => i + 1)
  const startDayOfWeek = currentDate.startOf('month').day()

  const eventsByDate = upcomingEvents.reduce((acc, event) => {
    const eventDate = dayjs(event.contestStartDate).format('YYYY-MM-DD')
    if (!acc[eventDate]) acc[eventDate] = []
    acc[eventDate].push(event)
    return acc
  }, {})

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid lg:grid-cols-[400px,1fr] gap-8">
        <div className="space-y-6 max-h-[700px] overflow-y-auto">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Upcoming Contests</h2>
            <p className="text-gray-500">Do not miss contests!</p>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">
                      {new Date(event.contestStartDate).toISOString().split("T")[0]}{" "}
                      ({new Date(event.contestStartDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(new Date(event.contestStartDate).getTime() + event.contestDuration * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                    </div>
                    <div className="font-medium mt-1 flex items-center">
                      <span className="text-blue-600 font-semibold bg-blue-100 px-2 py-0.5 rounded-full mr-2">
                        {event.platform.charAt(0).toUpperCase() + event.platform.slice(1)}
                      </span>
                      {event.contestName}
                      <Link href={event.contestUrl} passHref target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 text-gray-400 ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-6">
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
                  className={`aspect-square p-1 border rounded-lg hover:bg-gray-50 transition-colors ${events ? 'bg-blue-100' : ''}`}
                >
                  <div className="text-sm text-gray-600">{day}</div>
                  {events && (
                    <div className="flex flex-col gap-2 mt-1">
                      {events.map((event, i) => (
                        <Link key={i} href={event.contestUrl} target="_blank" rel="noopener noreferrer">
                          <Image
                            src={platformLogos[event.platform]}
                            alt={event.platform}
                            width={50}
                            height={20}
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
