import Leaderboard from "../components/Leaderboard";
import members from "../json/members.json";
export default function Home() {
  const memberList = Object.values(members);
  
  return <Leaderboard />;
}