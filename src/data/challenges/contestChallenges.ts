import type { Challenge } from '../../types/game';

export const contestChallenges: Challenge[] = [
  {
    id: 'tc1',
    name: 'Oura Sleep Contest',
    tier: 1,
    duration: 30,
    category: 'Contests',
    description: `In every Contest:

The top 10% performer(s) share 75% of the available reward pool, which could mean:

<div class="space-y-2 mt-2">
  <div class="flex items-start gap-2">
    <span class="text-orange-500 mt-1">•</span>
    <span class="text-orange-500">20 players: $450 each for top 2 players (6X return)</span>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-orange-500 mt-1">•</span>
    <span class="text-orange-500">8 players: $360 for top player (4X return)</span>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-orange-500 mt-1">•</span>
    <span class="text-orange-500">Plus: Score in the top 50% and earn your entry fee back</span>
  </div>
</div>`,
    expertReference: 'Health Rocket Team - Gamifying Health to Increase HealthSpan',
    learningObjectives: [
      'Master sleep optimization',
      'Develop consistent sleep tracking',
      'Build sleep-focused habits'
    ],
    requirements: [
      {
        description: 'Daily Oura Ring sleep score verification (40% of score)',
        verificationMethod: 'verification_posts',
        weight: 40
      },
      {
        description: 'Daily Sleep boost completion (40% of score)',
        verificationMethod: 'boost_completion',
        weight: 40
      },
      {
        description: 'Bonus points for the most nights above 85 Sleep Score (20% of score)',
        verificationMethod: 'bonus_points',
        weight: 20
      }
    ],
    implementationProtocol: {
      week1: 'Establish baseline sleep tracking and daily verification routine',
      week2: 'Focus on sleep score optimization and consistency',
      week3: 'Maintain progress and track milestones',
      week4: 'Complete final week and maximize scores'
    },
    howToPlay: {
      description: 'Join this Contest to compete for prizes while optimizing your sleep quality:',
      steps: [
        'Register with $75 entry fee to secure your spot',
        'Post daily Oura Ring sleep score screenshots in the Challenge Chat',
        'Complete at least one Sleep category boost daily',
        'Aim for sleep scores above 85 for bonus points',
        'Track your progress on the leaderboard',
        'Top 10% share 75% of prize pool, top 50% get entry fee back'
      ]
    },
    relatedCategories:["Sleep"],
    successMetrics: [
      'Daily verification posts (0/30)',
      'Daily Sleep boosts (0/30)',
      'Bonus points for scores above 85'
    ],
    expertTips: [
      'Maintain consistent sleep/wake times',
      'Optimize bedroom temperature (65-67°F)',
      'Limit blue light exposure before bed',
      'Practice relaxation techniques',
      'Track and optimize your sleep latency'
    ],
    fuelPoints: 100,
    status: 'available',
    isPremium: true,
    entryFee: 75,
    minPlayers: 8,
    startDate: '2025-04-15T04:00:00.000Z'  // 12:00 AM EDT = 4:00 AM UTC
  },
  {
    id: 'tc2',
    name: '100-Mile HOKA Contest',
    tier: 1,
    duration: 30,
    category: 'Contests',
    description: `In every Contest:

The top 10% performer(s) share 75% of the available reward pool, which could mean:

<div class="space-y-2 mt-2">
  <div class="flex items-start gap-2">
    <span class="text-orange-500 mt-1">•</span>
    <span class="text-orange-500">20 players: $450 each for top 2 players (6X return)</span>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-orange-500 mt-1">•</span>
    <span class="text-orange-500">8 players: $360 for top player (4X return)</span>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-orange-500 mt-1">•</span>
    <span class="text-orange-500">Plus: Score in the top 50% and earn your entry fee back</span>
  </div>
</div>`,
    expertReference: 'Health Rocket Team - Gamifying Health to Increase HealthSpan',
    learningObjectives: [
      'Complete 100 miles in 30 days',
      'Build consistent exercise habits',
      'Track progress with Strava'
    ],
    requirements: [
      {
        description: 'Complete 100 miles of running or walking (60% of score)',
        verificationMethod: 'strava_distance',
        weight: 60
      },
      {
        description: 'Daily Exercise boost completion (20% of score)',
        verificationMethod: 'boost_completion',
        weight: 20
      },
      {
        description: 'Bonus points for each 5 miles completed over the 100 mile goal (20% of score)',
        verificationMethod: 'distance_bonus',
        weight: 20
      }
    ],
    implementationProtocol: {
      week1: 'Connect Strava and establish baseline activity',
      week2: 'Build consistent mileage',
      week3: 'Maintain progress and track milestones',
      week4: 'Complete remaining distance and final verification'
    },
    howToPlay: {
      description: 'Join this Contest to compete for prizes while completing 100 miles:',
      steps: [
        'Register with $75 entry fee to secure your spot',
        'Connect your Strava account for automatic tracking',
        'Complete daily running or walking activities',
        'Complete at least one Exercise boost daily',
        'Track your progress on the leaderboard',
        'Top 10% share 75% of prize pool, top 50% get entry fee back'
      ]
    },
    relatedCategories:["Exercise"],
    successMetrics: [
      'Total distance completed',
      'Daily activity consistency',
      'Exercise boost completion rate'
    ],
    expertTips: [
      'Start with shorter distances and build up gradually',
      'Mix walking and running based on your fitness level',
      'Stay hydrated and maintain proper form',
      'Listen to your body and take rest days when needed',
      'Use the chat to connect with other participants'
    ],
    fuelPoints: 100,
    status: 'available',
    isPremium: true,
    entryFee: 75,
    minPlayers: 8,
    startDate: '2025-04-15T04:00:00.000Z'  // 12:00 AM EDT = 4:00 AM UTC
  }
];