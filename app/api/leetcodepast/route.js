import axios from 'axios';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

async function fetchContestRankingHistory(username) {
    const query = `
        query userContestRankingInfo($username: String!) {
            userContestRankingHistory(username: $username) {
                attended
                ranking
                contest {
                    title
                    startTime
                }
            }
        }
    `;
    
    const variables = { username };

    try {
        const response = await axios.post("https://leetcode.com/graphql", {
            query: query,
            variables: variables
        });

        if (response.data.data.userContestRankingHistory) {
            return response.data.data.userContestRankingHistory.map(contest => ({
                ranking: contest.ranking,
                contestTitle: contest.contest.title,
                contestStartTime: contest.contest.startTime
            }));
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching contest data for ${username}:`, error.message);
        return null;
    }
}

export async function GET(req) {
    const url = new URL(req.url);
    const contestName = url.searchParams.get('contestName') || 'weekly-contest-422';

    const filePath = path.resolve(process.cwd(), 'json/members.json');
    let users;

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        users = JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return NextResponse.json({ error: 'Failed to read users file' }, { status: 500 });
    }

    const userHandles = Object.values(users).map(user => user.lc_username);

    const results = [];

    for (let i = 0; i < userHandles.length; i++) {
        const handle = userHandles[i];
        const user = Object.values(users).find(u => u.lc_username === handle);

        const contestData = await fetchContestRankingHistory(handle);

        if (contestData && contestData.length > 0) {
            const filteredContestData = contestData.filter(contest => 
                contest.contestTitle.toLowerCase().includes(contestName.toLowerCase()) && contest.ranking !== 0
            );

            if (filteredContestData.length > 0) {
                results.push({
                    name: user.name, 
                    handle,
                    standing: filteredContestData[0].ranking  
                });
            }
        }
    }

    const filteredResults = results.filter(result => result.standing !== undefined);

    return NextResponse.json(filteredResults);
}
