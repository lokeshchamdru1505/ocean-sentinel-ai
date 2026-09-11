import React, { createContext, useContext, useState, useEffect } from 'react';
import { AnalysisResult, AppSettings } from '../types';
import { storageService } from '../services/storageService';

interface DemoUserProfile {
  name: string;
  role: string;
  institution: string;
  avatarInitials: string;
  clearanceLevel: string;
  email?: string;
}

interface AppContextType {
  analyses: AnalysisResult[];
  settings: AppSettings;
  userProfile: DemoUserProfile;
  isLoggedIn: boolean;
  login: (name: string, role: string, email?: string) => void;
  logout: () => void;
  refreshAnalyses: () => void;
  deleteAnalysis: (id: string) => void;
  resetAllData: () => void;
  clearAllAnalyses: () => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  notification: string | null;
  setNotification: (msg: string | null) => void;
}

const defaultSettings: AppSettings = {
  demoMode: true,
  animationsEnabled: true,
  theme: 'deep-ocean',
  autoProcessOnUpload: false,
  confidenceThreshold: 75,
  highRiskAlerts: true,
};

const defaultProfile: DemoUserProfile = {
  name: 'Dr. Kalaiyarasan K.',
  role: 'Chief Marine Sonar Scientist',
  institution: 'National Institute of Ocean Technology (NIOT)',
  avatarInitials: 'NIOT',
  clearanceLevel: 'MoES Level-4 Research Clearance',
  email: 'kalaiyarasan@niot.res.in',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('ocean_sentinel_settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [userProfile, setUserProfile] = useState<DemoUserProfile>(() => {
    try {
      const saved = localStorage.getItem('ocean_sentinel_user');
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ocean_sentinel_is_logged_in') === 'true';
    } catch {
      return true; // Default logged in for smooth demo experience
    }
  });

  const [notification, setNotification] = useState<string | null>(null);

  const login = (name: string, role: string, email?: string) => {
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'OP';

    const newProfile: DemoUserProfile = {
      name,
      role,
      institution: 'National Hydrographic Office / NIOT',
      avatarInitials: initials,
      clearanceLevel: 'MoES Level-4 Research Clearance',
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@niot.res.in`,
    };

    setUserProfile(newProfile);
    setIsLoggedIn(true);
    localStorage.setItem('ocean_sentinel_user', JSON.stringify(newProfile));
    localStorage.setItem('ocean_sentinel_is_logged_in', 'true');
    setNotification(`Welcome back, ${name}! Logged in as ${role}.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('ocean_sentinel_is_logged_in', 'false');
    setNotification('Logged out successfully.');
    setTimeout(() => setNotification(null), 3000);
  };

  const refreshAnalyses = () => {
    try {
      const list = storageService.getAllAnalyses();
      setAnalyses(list);
    } catch (e) {
      console.warn('refreshAnalyses failed gracefully:', e);
    }
  };

  useEffect(() => {
    refreshAnalyses();
  }, []);

  const deleteAnalysis = (id: string) => {
    // Optimistic update: remove from React state immediately (instant UI)
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
    // Sync to localStorage in background
    storageService.deleteAnalysis(id);
    setNotification(`Analysis ${id} removed from survey database.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const resetAllData = () => {
    storageService.resetAllData();
    refreshAnalyses();
    setNotification('Database successfully reset to official SIH 2026 ground truth dataset.');
    setTimeout(() => setNotification(null), 4000);
  };

  const clearAllAnalyses = () => {
    storageService.clearAllAnalyses();
    refreshAnalyses();
    setNotification('All analysis history cleared from survey database.');
    setTimeout(() => setNotification(null), 4000);
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    localStorage.setItem('ocean_sentinel_settings', JSON.stringify(updated));
    setNotification('System preferences updated.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <AppContext.Provider
      value={{
        analyses,
        settings,
        userProfile,
        isLoggedIn,
        login,
        logout,
        refreshAnalyses,
        deleteAnalysis,
        resetAllData,
        clearAllAnalyses,
        updateSettings,
        notification,
        setNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
