"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import axios from "axios"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Medal } from "lucide-react"
import { useSearchParams } from 'next/navigation'

const platformLogos = {
  codeforces: "https://upload.wikimedia.org/wikipedia/en/3/38/Codeforces%27s_new_logo.png",
  leetcode: "https://upload.wikimedia.org/wikipedia/commons/0/0a/LeetCode_Logo_black_with_text.svg",
  codechef: "https://upload.wikimedia.org/wikipedia/en/7/7b/Codechef%28new%29_logo.svg",
}

const platformColors = {
  leetcode: "from-yellow-400 to-orange-500",
  codeforces: "from-blue-400 to-blue-600",
}

export default function ContestLeaderboard() {
  const searchParams = useSearchParams()
  const contestName = searchParams.get('contestName')
  const platform = searchParams.get('platform')
  const contestId = searchParams.get('contestId')

  const [searchTerm, setSearchTerm] = useState("")
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true)
      try {
        let response;
        if (platform === "codeforces" && contestId) {
          response = await axios.get(`/api/codeforcespast?contestId=${contestId}`);
        } else if (platform === "leetcode" && contestName) {
          response = await axios.get(`/api/leetcodepast?contestName=${contestName}`);
        }
        if (response?.data) {
          setParticipants(response.data);
        }
      } catch (error) {
        console.error(`Failed to fetch standings for ${platform}:`, error);
      } finally {
        setLoading(false)
      }
    }

    if (platform && (contestId || contestName)) fetchParticipants();
  }, [platform, contestId, contestName])

  const filteredParticipants = participants.filter(
    participant =>
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.handle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className={`mb-8 rounded-lg bg-gradient-to-r ${platformColors[platform]} p-6 text-white shadow-xl`}
      >
        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-white opacity-50"></div>
            <Image
              src={platformLogos[platform]}
              alt={`${platform} logo`}
              width={60}
              height={60}
              className="relative h-16 w-16 rounded-full border-4 border-white shadow-lg"
            />
          </div>
          <h1 className="text-center text-3xl font-extrabold sm:text-4xl text-white">
            {contestName || "Default Contest Name"}
          </h1>
        </div>
      </div>
      <div className="mb-6 flex justify-center">
        <Input
          type="text"
          placeholder="Search participants..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-2xl font-semibold">Loading...</span>
        </div>
      ) : (
        <div className="rounded-lg border bg-white shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-200">
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Handle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.map((participant, index) => (
                <TableRow
                  key={participant.handle}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} transition-all hover:bg-gray-100`}
                >
                  <TableCell className="font-semibold">
                    {participant.standing <= 3 ? (
                      <div className="flex items-center space-x-2">
                        <Medal
                          className={`h-5 w-5 ${
                            participant.standing === 1
                              ? "text-yellow-400"
                              : participant.standing === 2
                              ? "text-gray-400"
                              : "text-orange-400"
                          }`}
                        />
                        <span>{participant.standing}</span>
                      </div>
                    ) : (
                      participant.standing
                    )}
                  </TableCell>
                  <TableCell className="text-lg font-medium">{participant.name}</TableCell>
                  <TableCell className="font-mono text-sm text-blue-600">
                    {participant.handle}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
