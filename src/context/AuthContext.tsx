import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 直接设置isLoading为false，跳过加载用户
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Login attempt:', username, password);
      if ((username === 'admin' && password === 'admin123') || (username === 'user' && password === 'user123')) {
        const userData: User = {
          username,
          role: username === 'admin' ? '管理员' : '操作员',
          avatar: '👤'
        };
        
        console.log('Login successful, setting user:', userData);
        // 暂时移除AsyncStorage的使用
        // await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
        setUser(userData);
        console.log('User state updated, new user:', user);
        return true;
      }
      console.log('Login failed: invalid credentials');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // 暂时移除AsyncStorage的使用
      // await AsyncStorage.removeItem(CURRENT_USER_KEY);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!oldPassword) {
        return { success: false, message: '请输入原密码' };
      }
      if (!newPassword) {
        return { success: false, message: '请输入新密码' };
      }
      if (newPassword.length < 6) {
        return { success: false, message: '新密码长度不能少于6位' };
      }
      if (newPassword !== confirmPassword) {
        return { success: false, message: '两次输入的新密码不一致' };
      }
      
      // 验证原密码是否正确
      const isAdmin = user?.username === 'admin';
      const validPassword = isAdmin ? oldPassword === 'admin123' : oldPassword === 'user123';
      
      if (!validPassword) {
        return { success: false, message: '原密码错误' };
      }
      
      // 密码修改成功（实际应用中应该调用API保存）
      return { success: true, message: '密码修改成功' };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: '修改密码失败，请重试' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}