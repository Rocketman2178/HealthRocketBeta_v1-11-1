import { useState, useEffect } from "react";
import { Radio, Trophy, Target, Zap, Users, Rocket } from 'lucide-react';
import { scrollToSection } from '../../lib/utils';
import { useCosmo } from "../../contexts/CosmoContext";
import { TabNav } from "./TabNav";
import { Card } from "../ui/card";
import { CosmoChat } from "../cosmo/CosmoChat";
import { CompanyLogo } from "./header/CompanyLogo";
import { DashboardHeader } from "./header/DashboardHeader";
import { MyRocket } from "./rocket/MyRocket";
import { RankStatus } from "./rank/RankStatus";
import { QuestCard } from "./quest/QuestCard";
import { ChallengeGrid } from "./challenge/ChallengeGrid";
import { ContestsGrid } from "./contests/ContestsGrid";
import { DailyBoosts } from "./boosts/DailyBoosts";
import { useSupabase } from "../../contexts/SupabaseContext";
import { useDashboardData } from "../../hooks/useDashboardData";
import { usePlayerStats } from "../../hooks/usePlayerStats";
import { FPCongrats } from "../ui/fp-congrats";
import { useBoostState } from "../../hooks/useBoostState";
import { supabase } from "../../lib/supabase";
import { formatInTimeZone } from 'date-fns-tz';

export function CoreDashboard() {
  const [fpEarned, setFpEarned] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('cosmo');
  const { user } = useSupabase();
  const {
    data,
    loading: dashboardLoading,
    refreshData,
  } = useDashboardData(user);
  const { stats, loading: statsLoading, refreshStats } = usePlayerStats(user);
  const { showCosmo } = useCosmo();
  const {
    selectedBoosts,
    weeklyBoosts,
    daysUntilReset,
    completeBoost,
    isLoading: boostLoading,
  } = useBoostState(user?.id);

  // Listen for dashboard update events
  useEffect(() => {
    const handleDashboardUpdate = async () => {
      try {
        await Promise.all([refreshData(), refreshStats()]);
      } catch (err) {
        console.error("Error updating dashboard:", err);
      }
    };

    const handleUpdate = (event: Event) => {
      // Check if event has FP earned data
      if (event instanceof CustomEvent && event.detail?.fpEarned) {
        setFpEarned(event.detail.fpEarned);
      }

      if (event.type === "dashboardUpdate") {
        handleDashboardUpdate();
      }
    };

    window.addEventListener("dashboardUpdate", handleUpdate);
    return () => window.removeEventListener("dashboardUpdate", handleUpdate);
  }, [refreshData, refreshStats]);

  
  useEffect(() => {
    const NewYorkTimeZone = 'America/New_York';
    const resetBurnStreak = async () => {
      if (!user?.id) return;
      await supabase.rpc("check_and_reset_burn_streaks");
    };
  
    const scheduleReset = () => {
      const now = new Date();
      const newYorkTime = formatInTimeZone(now, NewYorkTimeZone, 'yyyy-MM-dd HH:mm:ssXXX');
      const midnight = new Date(newYorkTime);
      midnight.setHours(24, 0, 0, 0);
      const timeUntilMidnight = midnight.getTime() - now.getTime() + 60 * 1000; 
      const timeoutId = setTimeout(async () => {
        await resetBurnStreak();
        scheduleReset(); 
      }, timeUntilMidnight);
  
      return timeoutId;
    };
    const timeoutId = scheduleReset();
    return () => clearTimeout(timeoutId);
  }, [user?.id]); 
  // Handle closing the FP congrats modal
  const handleCloseModal = () => {
    setFpEarned(null);
  };

  // Show loading state while data is being fetched
  if ((dashboardLoading || statsLoading) && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Ensure we have data before rendering
  if (!data) {
    return null;
  }

  return (
    <div className="relative">
      {fpEarned !== null && (
        <FPCongrats fpEarned={fpEarned} onClose={handleCloseModal} />
      )}
      <CompanyLogo />
      <div>
        <DashboardHeader
          healthSpanYears={data.healthSpanYears}
          healthScore={data.healthScore}
          level={stats.level}
          nextLevelPoints={stats.nextLevelPoints}
        />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-6">
        <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-4 my-6">
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => {
                setActiveTab('standings');
                scrollToSection('leaderboard', 'start');
              }}
              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                (activeTab === 'standings' || activeTab === 'boosts' || activeTab === 'challenges')
                  ? 'bg-orange-500/20 text-orange-500' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800/70 hover:text-white'
              }`}
            >
              <Rocket size={28} className={(activeTab === 'standings' || activeTab === 'boosts' || activeTab === 'challenges') ? 'text-orange-500' : 'text-gray-400'} />
              <span className="text-sm">HealthSpan Mission</span>
            </button>
            <button
              onClick={() => setActiveTab('contests')}
              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'contests' 
                  ? 'bg-orange-500/20 text-orange-500' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800/70 hover:text-white'
              }`}
            >
              <Trophy size={28} className={activeTab === 'contests' ? 'text-orange-500' : 'text-gray-400'} />
              <span className="text-sm">Contest Arena</span>
            </button>
            <button
              onClick={() => setActiveTab('cosmo')}
              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'cosmo' 
                  ? 'bg-orange-500/20 text-orange-500' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800/70 hover:text-white'
              }`}
            >
              <Radio size={28} className={activeTab === 'cosmo' ? 'text-orange-500' : 'text-gray-400'} />
              <span className="text-sm">Cosmo Guide</span>
            </button>
          </div>
        </div>
        {/* Show TabNav only when in HealthSpan Mission */}
        {activeTab !== 'contests' && activeTab !== 'cosmo' ? (
          <>
            
            <h2 className="text-xl font-bold text-white">HealthSpan Mission</h2>
            
            <MyRocket
              level={stats.level}
              fuelPoints={stats.fuelPoints}
              nextLevelPoints={stats.nextLevelPoints}
            />
            
            <TabNav 
              activeTab={activeTab} 
              onTabChange={(tab) => {
                setActiveTab(tab);
                // Scroll to appropriate section
                if (tab === 'standings') {
                  document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth' });
                } else if (tab === 'challenges') {
                  document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth' });
                } else if (tab === 'boosts') {
                  document.getElementById('boosts')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
            
            {activeTab === 'standings' && <RankStatus />}
            
            {activeTab === 'boosts' && (
              <DailyBoosts
                burnStreak={stats.burnStreak}
                completedBoosts={data.completedBoosts}
                selectedBoosts={selectedBoosts}
                weeklyBoosts={weeklyBoosts}
                daysUntilReset={daysUntilReset}
                onCompleteBoost={completeBoost}
              />
            )}

            {activeTab === 'challenges' && (
              <>
                <ChallengeGrid
                  userId={user?.id}
                  categoryScores={data.categoryScores}
                  verificationRequirements={data.verificationRequirements}
                />
                
                <QuestCard 
                  userId={user?.id} 
                  categoryScores={data.categoryScores} 
                />
              </>
            )}
          </>
        ) : activeTab === 'contests' ? (
          <ContestsGrid />
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Cosmo Guide</h2>
            <Card className="p-4">
            <div className="flex items-center gap-2 mb-6">
              <Radio className="text-orange-500" size={24} />
              <h3 className="text-lg font-medium text-white">Your AI Health Assistant</h3>
            </div>
            <CosmoChat 
              onClose={() => setActiveTab('standings')}
              setActiveTab={setActiveTab}
            />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}