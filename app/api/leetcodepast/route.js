import axios from 'axios';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

        try {
            const params = new URLSearchParams({
                contest_name: contestName,
                username: handle,
                archived: 'false'
            });

            const response = await axios.get(`https://lccn.lbao.site/api/v1/contest-records/user?${params.toString()}`);

            if (Array.isArray(response.data) && response.data.length > 0) {
                const topResult = response.data[0]; 

                results.push({
                    name: user.name,
                    handle,
                    standing: topResult.rank
                });
            } else {
                results.push(null);
            }
        } catch (error) {
            console.error(`Failed to fetch data for handle ${handle}:`, error.message);
        }
        if (i < userHandles.length - 1) {
            console.log(`Waiting for 2 seconds before the next request...`);
            await delay(2000);
        }
    }

    const filteredResults = results.filter(result => result !== null);

    return NextResponse.json(filteredResults);
}
