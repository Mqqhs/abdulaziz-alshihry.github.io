import { useState, useEffect } from 'react';
import { Trophy, Star, Award, Clock, CheckCircle, XCircle, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

interface UserStats {
  username: string;
  totalScore: number;
  streak: number;
  lastPlayedDate: string;
  achievements: string[];
  dailyScores: { date: string; score: number }[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  condition: (stats: UserStats) => boolean;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    category: "Geography"
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    category: "Science"
  },
  {
    id: 3,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
    category: "Art"
  },
  {
    id: 4,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
    category: "Geography"
  },
  {
    id: 5,
    question: "In what year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
    category: "History"
  }
];

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Complete your first daily challenge',
    icon: Star,
    condition: (stats) => stats.dailyScores.length >= 1
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get all questions correct in a challenge',
    icon: Trophy,
    condition: (stats) => stats.dailyScores.some(s => s.score === 100)
  },
  {
    id: 'streak_3',
    name: '3-Day Streak',
    description: 'Play for 3 consecutive days',
    icon: Crown,
    condition: (stats) => stats.streak >= 3
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Play for 7 consecutive days',
    icon: Award,
    condition: (stats) => stats.streak >= 7
  },
  {
    id: 'score_500',
    name: 'Rising Star',
    description: 'Reach 500 total points',
    icon: Star,
    condition: (stats) => stats.totalScore >= 500
  }
];

export default function TriviaGame() {
  const [gameState, setGameState] = useState<'welcome' | 'playing' | 'results' | 'leaderboard'>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [username, setUsername] = useState('');
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    const savedStats = localStorage.getItem('triviaUserStats');
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setUserStats(stats);
      setUsername(stats.username);
    }
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && selectedAnswer === null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswerSubmit(null);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, selectedAnswer, currentQuestion]);

  const startGame = () => {
    if (!username.trim()) return;

    let stats = userStats;
    if (!stats) {
      stats = {
        username: username.trim(),
        totalScore: 0,
        streak: 0,
        lastPlayedDate: '',
        achievements: [],
        dailyScores: []
      };
    }

    const today = getTodayDate();
    const hasPlayedToday = stats.dailyScores.some(s => s.date === today);

    if (hasPlayedToday) {
      alert("You've already completed today's challenge! Come back tomorrow for a new one.");
      return;
    }

    setUserStats(stats);
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setTimeLeft(15);
  };

  const handleAnswerSubmit = (answer: number | null) => {
    const isCorrect = answer === QUESTIONS[currentQuestion].correctAnswer;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);

    if (isCorrect) {
      const points = 20;
      setScore(score + points);
    }

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setTimeLeft(15);
      } else {
        finishGame(newAnswers);
      }
    }, 1000);
  };

  const finishGame = (finalAnswers: boolean[]) => {
    const finalScore = (finalAnswers.filter(a => a).length / QUESTIONS.length) * 100;

    if (!userStats) return;

    const today = getTodayDate();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = 1;
    if (userStats.lastPlayedDate === yesterday) {
      newStreak = userStats.streak + 1;
    } else if (userStats.lastPlayedDate === today) {
      newStreak = userStats.streak;
    }

    const updatedStats: UserStats = {
      ...userStats,
      totalScore: userStats.totalScore + finalScore,
      streak: newStreak,
      lastPlayedDate: today,
      dailyScores: [...userStats.dailyScores, { date: today, score: finalScore }]
    };

    const previousAchievements = new Set(userStats.achievements);
    const newAchievements = ACHIEVEMENTS.filter(
      achievement => achievement.condition(updatedStats) && !previousAchievements.has(achievement.id)
    );

    if (newAchievements.length > 0) {
      updatedStats.achievements = [...userStats.achievements, ...newAchievements.map(a => a.id)];
      setShowAchievement(newAchievements[0]);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setUserStats(updatedStats);
    localStorage.setItem('triviaUserStats', JSON.stringify(updatedStats));
    setGameState('results');
  };

  const getAllUsers = (): UserStats[] => {
    const allUsers: UserStats[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('triviaUser_')) {
        const user = JSON.parse(localStorage.getItem(key) || '{}');
        allUsers.push(user);
      }
    }
    if (userStats && !allUsers.find(u => u.username === userStats.username)) {
      allUsers.push(userStats);
    }
    return allUsers.sort((a, b) => b.totalScore - a.totalScore);
  };

  if (gameState === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl mb-2">Daily Trivia Challenge</h1>
            <p className="text-gray-600">Test your knowledge and climb the leaderboard!</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm">Enter your username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && startGame()}
              />
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
            >
              Start Challenge
            </button>

            {userStats && (
              <button
                onClick={() => setGameState('leaderboard')}
                className="w-full bg-white border-2 border-purple-600 text-purple-600 py-3 rounded-lg hover:bg-purple-50 transition-all"
              >
                View Leaderboard
              </button>
            )}
          </div>

          {userStats && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl">{userStats.totalScore.toFixed(0)}</div>
                  <div className="text-xs text-gray-500">Total Score</div>
                </div>
                <div>
                  <div className="text-2xl">{userStats.streak}</div>
                  <div className="text-xs text-gray-500">Day Streak</div>
                </div>
                <div>
                  <div className="text-2xl">{userStats.achievements.length}</div>
                  <div className="text-xs text-gray-500">Achievements</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const question = QUESTIONS[currentQuestion];
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {QUESTIONS.length}</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className={`${timeLeft <= 5 ? 'text-red-500' : 'text-gray-600'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm mb-4">
              {question.category}
            </span>
            <h2 className="text-2xl mb-6">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showResult = selectedAnswer !== null;

                let buttonClass = "w-full text-left px-6 py-4 rounded-xl border-2 transition-all ";

                if (showResult) {
                  if (isCorrect) {
                    buttonClass += "border-green-500 bg-green-50";
                  } else if (isSelected) {
                    buttonClass += "border-red-500 bg-red-50";
                  } else {
                    buttonClass += "border-gray-200 bg-gray-50";
                  }
                } else {
                  buttonClass += isSelected
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-300 hover:border-purple-400 hover:bg-purple-50";
                }

                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (selectedAnswer === null) {
                        setSelectedAnswer(index);
                        handleAnswerSubmit(index);
                      }
                    }}
                    disabled={selectedAnswer !== null}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>Score: {score}</div>
            <div>{answers.filter(a => a).length} / {answers.length} correct</div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'results') {
    const finalScore = (answers.filter(a => a).length / QUESTIONS.length) * 100;
    const unlockedAchievements = ACHIEVEMENTS.filter(a => userStats?.achievements.includes(a.id));

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl mb-2">Challenge Complete!</h2>
            <p className="text-gray-600">Great job, {userStats?.username}!</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 mb-6">
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">{finalScore.toFixed(0)}%</div>
              <div className="text-gray-600">Your Score</div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-purple-200">
              <div>
                <div className="text-2xl">{answers.filter(a => a).length}/{QUESTIONS.length}</div>
                <div className="text-xs text-gray-600">Correct</div>
              </div>
              <div>
                <div className="text-2xl">{userStats?.streak}</div>
                <div className="text-xs text-gray-600">Day Streak</div>
              </div>
              <div>
                <div className="text-2xl">{userStats?.totalScore.toFixed(0)}</div>
                <div className="text-xs text-gray-600">Total Score</div>
              </div>
            </div>
          </div>

          {showAchievement && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <showAchievement.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-orange-600 mb-1">New Achievement!</div>
                  <div className="font-semibold">{showAchievement.name}</div>
                  <div className="text-sm text-gray-600">{showAchievement.description}</div>
                </div>
              </div>
            </div>
          )}

          {unlockedAchievements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm mb-3">Your Achievements ({unlockedAchievements.length})</h3>
              <div className="grid grid-cols-5 gap-2">
                {unlockedAchievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center group relative"
                      title={achievement.name}
                    >
                      <Icon className="w-6 h-6 text-purple-600" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setGameState('leaderboard')}
              className="flex-1 bg-white border-2 border-purple-600 text-purple-600 py-3 rounded-lg hover:bg-purple-50 transition-all"
            >
              View Leaderboard
            </button>
            <button
              onClick={() => setGameState('welcome')}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'leaderboard') {
    const allUsers = getAllUsers();
    const userRank = allUsers.findIndex(u => u.username === userStats?.username) + 1;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl mb-2">Leaderboard</h2>
                <p className="text-gray-600">Top trivia champions</p>
              </div>
              <button
                onClick={() => setGameState('welcome')}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                Back
              </button>
            </div>

            {userStats && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white">#{userRank}</span>
                    </div>
                    <div>
                      <div>Your Ranking</div>
                      <div className="text-sm text-gray-600">{userStats.username}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl">{userStats.totalScore.toFixed(0)}</div>
                    <div className="text-sm text-gray-600">points</div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {allUsers.slice(0, 10).map((user, index) => {
                const isCurrentUser = user.username === userStats?.username;
                const rankIcons = [
                  <Crown className="w-6 h-6 text-yellow-500" />,
                  <Trophy className="w-6 h-6 text-gray-400" />,
                  <Award className="w-6 h-6 text-orange-600" />
                ];

                return (
                  <div
                    key={user.username}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      isCurrentUser
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-400'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 text-center">
                        {index < 3 ? rankIcons[index] : <span className="text-gray-600">#{index + 1}</span>}
                      </div>
                      <div>
                        <div className={isCurrentUser ? '' : ''}>{user.username}</div>
                        <div className="text-sm text-gray-600">
                          {user.streak} day streak • {user.achievements.length} achievements
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl">{user.totalScore.toFixed(0)}</div>
                      <div className="text-xs text-gray-600">points</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
