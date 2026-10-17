import { UserStatsCard } from "./UserStatsCard";
import { WhoToFollow } from "./WhoToFollow";


export  function WhatsHappening () {
    return (
        <div>
         <div className="w-full h-[66vh] min-h-96 bg-gray-200 rounded-lg p-4 m-4 overflow-y-auto no-scrollbar">
            <h2 className="text-xl text-slate-600 font-bold mb-2">What&apos;s Happening</h2>
            <UserStatsCard />
            <WhoToFollow />
         </div>
        </div>
    );
}
