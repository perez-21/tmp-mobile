import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

// Simplified Type definitions
interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: "student" | "facilitator" | "admin" | "learner";
  avatar: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
  };
}

interface Course {
  id: string;
  _id: string;
  title: string;
  description: string;
  facilitatorName: string;
  thumbnail: string;
  category: string;
  progress: number;
  nextModule: string;
}

interface Activity {
  id: string;
  courseId: string;
  courseTitle: string;
  contentId: string;
  contentTitle: string;
  type: "lesson" | "quiz" | "assignment";
  action: "completed" | "started" | "submitted";
  createdAt: string;
}

interface XPData {
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  achievements: Achievement[];
  badges: Badge[];
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string;
  };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface TourLMSContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  enrolledCourses: Course[];
  CoursesHub: Course[];
  facilitatorCourses: Course[];
  coursesLoaded: boolean;
  userXP: XPData | null;
  xpLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  getCoursesHub: () => Promise<void>;
  packLoad: (user: User | null, token: string | null) => Promise<void>;
  updateUserPreferences: (preferences: {
    notifications?: boolean;
    darkMode?: boolean;
  }) => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  awardXP: (amount: number, reason: string) => Promise<void>;
  fetchUserXP: () => Promise<void>;
  calculateLevel: (totalXP: number) => {
    level: number;
    currentLevelXP: number;
    nextLevelXP: number;
  };
  fetchEnrolledCourses: () => Promise<Course[]>;
  fetchUserStats: () => Promise<void>;
  fetchRecentActivities: () => Promise<void>;
  fetchRecommendedCourses: () => Promise<Course[]>;
  refreshDashboard: () => Promise<void>;
}

const TourLMSContext = createContext<TourLMSContextType | undefined>(undefined);

// Hardcoded data
const HARDCODED_USER: User = {
  id: "u1",
  _id: "u1",
  name: "Akin Zulu",
  email: "akin.zulu@africanintelligence.com",
  role: "student",
  avatar: "https://via.placeholder.com/100x100?text=AZ",
  preferences: {
    notifications: true,
    darkMode: false,
  },
};

const HARDCODED_COURSES: Course[] = [
  {
    id: "c1",
    _id: "c1",
    title: "Introduction to Artificial Intelligence",
    description: "Learn the basics of AI and machine learning.",
    facilitatorName: "Jane Doe",
    thumbnail: "https://via.placeholder.com/800x400?text=AI+Course",
    category: "AI",
    progress: 50,
    nextModule: "Module 2: Machine Learning Basics",
  },
  {
    id: "c2",
    _id: "c2",
    title: "Data Science Fundamentals",
    description: "Master data analysis and visualization techniques.",
    facilitatorName: "John Smith",
    thumbnail: "https://via.placeholder.com/800x400?text=Data+Science",
    category: "Data Science",
    progress: 75,
    nextModule: "Module 3: Data Visualization",
  },
  {
    id: "c3",
    _id: "c3",
    title: "Web Development with React",
    description: "Build modern web applications with React.",
    facilitatorName: "Aisha Khan",
    thumbnail: "https://via.placeholder.com/800x400?text=Web+Dev",
    category: "Web Development",
    progress: 20,
    nextModule: "Module 1: React Components",
  },
];

const HARDCODED_FACILITATOR_COURSES: Course[] = [
  {
    id: "c4",
    _id: "c4",
    title: "Advanced Machine Learning",
    description: "Deep dive into neural networks and deep learning.",
    facilitatorName: "Jane Doe",
    thumbnail: "https://via.placeholder.com/800x400?text=Advanced+AI",
    category: "AI",
    progress: 0,
    nextModule: "Module 1: Neural Networks",
  },
];

const HARDCODED_XP_DATA: XPData = {
  totalXP: 1200,
  level: 3,
  currentLevelXP: 200,
  nextLevelXP: 400,
  achievements: [
    {
      id: "a1",
      name: "First Lesson",
      description: "Complete your first lesson",
      icon: "book-open",
      xpReward: 50,
      unlockedAt: "2025-07-01T10:00:00Z",
    },
  ],
  badges: [
    {
      id: "b1",
      name: "Beginner",
      description: "Enrolled in first course",
      icon: "star",
      earnedAt: "2025-07-01T10:00:00Z",
      rarity: "common",
    },
  ],
  streak: {
    current: 5,
    longest: 10,
    lastActiveDate: "2025-07-11T13:32:00Z",
  },
};

const HARDCODED_ACTIVITIES: Activity[] = [
  {
    id: "a1",
    courseId: "c1",
    courseTitle: "Introduction to Artificial Intelligence",
    contentId: "ct1",
    contentTitle: "Lesson 1: What is AI?",
    type: "lesson",
    action: "completed",
    createdAt: "2025-07-10T10:00:00Z",
  },
  {
    id: "a2",
    courseId: "c2",
    courseTitle: "Data Science Fundamentals",
    contentId: "ct2",
    contentTitle: "Quiz 1: Data Cleaning",
    type: "quiz",
    action: "submitted",
    createdAt: "2025-07-09T15:00:00Z",
  },
  {
    id: "a3",
    courseId: "c3",
    courseTitle: "Web Development with React",
    contentId: "ct3",
    contentTitle: "Lesson 2: State and Props",
    type: "lesson",
    action: "started",
    createdAt: "2025-07-08T12:00:00Z",
  },
];

const HARDCODED_RECOMMENDED_COURSES: Course[] = [
  {
    id: "c5",
    _id: "c5",
    title: "Python for Data Analysis",
    description: "Learn Python for data science applications.",
    facilitatorName: "Sarah Johnson",
    thumbnail: "https://via.placeholder.com/150x150?text=Python",
    category: "Data Science",
    progress: 0,
    nextModule: "Module 1: Python Basics",
  },
  {
    id: "c6",
    _id: "c6",
    title: "Deep Learning Essentials",
    description: "Explore deep learning techniques and frameworks.",
    facilitatorName: "Dr. Michael Brown",
    thumbnail: "https://via.placeholder.com/150x150?text=Deep+Learning",
    category: "AI",
    progress: 0,
    nextModule: "Module 1: Neural Networks",
  },
];

export function TourLMSProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({
    user: null as User | null,
    token: null as string | null,
    loading: false,
    enrolledCourses: [] as Course[],
    CoursesHub: HARDCODED_COURSES,
    facilitatorCourses: [] as Course[],
    coursesLoaded: true,
    userXP: null as XPData | null,
    xpLoading: false,
  });

  const calculateLevel = useMemo(
    () => (totalXP: number) => {
      let level = 1;
      let xpForCurrentLevel = 0;
      let xpForNextLevel = 100;

      while (totalXP >= xpForNextLevel) {
        xpForCurrentLevel = xpForNextLevel;
        level++;
        xpForNextLevel = xpForCurrentLevel + level * 100 + (level - 1) * 50;
      }

      return {
        level,
        currentLevelXP: totalXP - xpForCurrentLevel,
        nextLevelXP: xpForNextLevel - xpForCurrentLevel,
      };
    },
    []
  );

  const fetchUserXP = useCallback(async () => {
    setState((prev) => ({ ...prev, xpLoading: true }));
    setState((prev) => ({
      ...prev,
      userXP: HARDCODED_XP_DATA,
      xpLoading: false,
    }));
  }, []);

  const awardXP = async (amount: number, reason: string) => {
    if (!state.userXP) return;
    const newTotalXP = state.userXP.totalXP + amount;
    const levelData = calculateLevel(newTotalXP);
    setState((prev) => ({
      ...prev,
      userXP: prev.userXP
        ? {
            ...prev.userXP,
            totalXP: newTotalXP,
            level: levelData.level,
            currentLevelXP: levelData.currentLevelXP,
            nextLevelXP: levelData.nextLevelXP,
          }
        : null,
    }));
    await checkAchievements();
  };

  const checkAchievements = useCallback(async () => {
    if (!state.user || !state.userXP) return;
    const newAchievements = HARDCODED_XP_DATA.achievements.filter(
      (ach) =>
        !state.userXP?.achievements.some((existing) => existing.id === ach.id)
    );
    if (newAchievements.length > 0) {
      setState((prev) => ({
        ...prev,
        userXP: prev.userXP
          ? {
              ...prev.userXP,
              achievements: [...prev.userXP.achievements, ...newAchievements],
            }
          : null,
      }));
    }
  }, [state.user, state.userXP]);

  const packLoad = async (user: User | null, token: string | null) => {
    if (!user || !token) return;
    setState((prev) => ({
      ...prev,
      user,
      token,
      enrolledCourses: user.role === "student" ? HARDCODED_COURSES : [],
      facilitatorCourses:
        user.role === "facilitator" ? HARDCODED_FACILITATOR_COURSES : [],
      coursesLoaded: true,
    }));
    await fetchUserXP();
  };

  const getCoursesHub = async () => {
    setState((prev) => ({ ...prev, CoursesHub: HARDCODED_COURSES }));
  };

  const login = async (email: string, password: string) => {
    if (
      email === "akin.zulu@africanintelligence.com" &&
      password === "password123"
    ) {
      const user = HARDCODED_USER;
      const token = "mock-token-123";
      setState((prev) => ({
        ...prev,
        user,
        token,
      }));
      await packLoad(user, token);
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const user: User = {
      id: "u2",
      _id: "u2",
      name: userData.name,
      email: userData.email,
      role: userData.role as "student" | "facilitator" | "admin" | "learner",
      avatar: "https://via.placeholder.com/100x100?text=User",
      preferences: {
        notifications: true,
        darkMode: false,
      },
    };
    const token = "mock-token-" + Math.random().toString(36).substring(2);
    setState((prev) => ({
      ...prev,
      user,
      token,
    }));
    await packLoad(user, token);
  };

  const logout = async () => {
    setState({
      user: null,
      token: null,
      loading: false,
      enrolledCourses: [],
      CoursesHub: HARDCODED_COURSES,
      facilitatorCourses: [],
      coursesLoaded: true,
      userXP: null,
      xpLoading: false,
    });
  };

  const updateUserPreferences = async (preferences: {
    notifications?: boolean;
    darkMode?: boolean;
  }) => {
    if (!state.user) return;
    const updatedUser: User = {
      ...state.user,
      preferences: {
        notifications:
          preferences.notifications ?? state.user.preferences.notifications,
        darkMode: preferences.darkMode ?? state.user.preferences.darkMode,
      },
    };
    setState((prev) => ({
      ...prev,
      user: updatedUser,
    }));
  };

  const enrollInCourse = async (courseId: string) => {
    if (!state.user || !state.token) return;
    const course =
      HARDCODED_COURSES.find((c) => c.id === courseId) ||
      HARDCODED_RECOMMENDED_COURSES.find((c) => c.id === courseId);
    if (course && !state.enrolledCourses.some((c) => c.id === courseId)) {
      setState((prev) => ({
        ...prev,
        enrolledCourses: [...prev.enrolledCourses, course],
      }));
      await awardXP(50, "Course enrollment");
    }
  };

  const fetchEnrolledCourses = async () => {
    if (!state.user || !state.token) return [];
    return state.user.role === "student" ? HARDCODED_COURSES : [];
  };

  const fetchUserStats = async () => {
    console.log("User Stats:", {
      totalPoints: 100,
      rank: 2,
      completedCourses: 2,
      activeCourses: 3,
      currentStreak: state.userXP?.streak.current || 0,
      totalXp: state.userXP?.totalXP || 0,
      totalEnrolled: state.enrolledCourses.length,
      certificatesEarned: 1,
      completedLessons: 10,
      totalLessons: 20,
      completedQuizzes: 3,
      totalQuizzes: 5,
      averageScore: 85,
      lastActive:
        state.userXP?.streak.lastActiveDate || new Date().toISOString(),
      streakDays: state.userXP?.streak.current || 0,
    });
  };

  const fetchRecentActivities = async () => {
    console.log("Recent Activities:", HARDCODED_ACTIVITIES);
  };

  const fetchRecommendedCourses = async () => {
    return HARDCODED_RECOMMENDED_COURSES;
  };

  const refreshDashboard = async () => {
    await fetchUserXP();
    await fetchEnrolledCourses();
    await fetchUserStats();
    await fetchRecentActivities();
    await fetchRecommendedCourses();
  };

  const value = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      getCoursesHub,
      packLoad,
      updateUserPreferences,
      enrollInCourse,
      awardXP,
      fetchUserXP,
      calculateLevel,
      checkAchievements,
      fetchEnrolledCourses,
      fetchUserStats,
      fetchRecentActivities,
      fetchRecommendedCourses,
      refreshDashboard,
    }),
    [
      state,
      login,
      register,
      logout,
      getCoursesHub,
      packLoad,
      updateUserPreferences,
      enrollInCourse,
      awardXP,
      fetchUserXP,
      calculateLevel,
      checkAchievements,
      fetchEnrolledCourses,
      fetchUserStats,
      fetchRecentActivities,
      fetchRecommendedCourses,
      refreshDashboard,
    ]
  );

  return (
    <TourLMSContext.Provider value={value}>{children}</TourLMSContext.Provider>
  );
}

export function useTourLMS() {
  const context = useContext(TourLMSContext);
  if (context === undefined) {
    throw new Error("useTourLMS must be used within a TourLMSProvider");
  }
  return context;
}

export default TourLMSProvider;
