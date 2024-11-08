import crypto from 'crypto';
import axios from 'axios';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req) {
    const url = new URL(req.url);
    const contestId = url.searchParams.get('contestId');

    const apiKey = process.env.CODEFORCES_API_KEY;
    const secret = process.env.CODEFORCES_SECRET;

    if (!apiKey || !secret || !contestId) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const filePath = path.resolve(process.cwd(), 'json/members.json');
    let userHandles = [];
    let userMapping = {};

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const users = JSON.parse(data);

        // Map cf_username to actual name
        userHandles = Object.values(users).map(user => user.cf_username);
        userMapping = Object.fromEntries(
            Object.values(users).map(user => [user.cf_username, user.name])
        );
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return NextResponse.json({ error: 'Failed to read users file' }, { status: 500 });
    }
    console.log(userHandles);

    const method = 'contest.standings';

    const rand = '123456';

    const unixTime = Math.floor(Date.now() / 1000).toString();

    const params = {
        apiKey,
        time: unixTime,
        contestId,
        handles: userHandles.join(';'),
        showUnofficial : true
    };

    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');

    const baseString = `${rand}/${method}?${sortedParams}#${secret}`;
    const hash = crypto.createHash('sha512').update(baseString).digest('hex');
    const apiSig = `${rand}${hash}`;
    params.apiSig = apiSig;

    try {
        const response = await axios.get(`https://codeforces.com/api/${method}`, { params });

        if (response.data.status === "OK") {
            const standings = response.data.result.rows;

            const formattedData = standings
                .filter(row => row.rank > 0) 
                .map((row) => {
                    const userHandle = row.party.members[0].handle;
                    const userName = userMapping[userHandle] || "Unknown";

                    return {
                        name: userName,
                        handle: userHandle,
                        standing: row.rank
                    };
                });

            return NextResponse.json(formattedData);
        } else {
            return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 });
        }
    } catch (error) {
        console.error("Error fetching Codeforces API data:", error.message);
        return NextResponse.json({ error: 'Failed to fetch data from Codeforces API' }, { status: 500 });
    }
}
