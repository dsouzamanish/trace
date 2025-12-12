import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { RootState, AppDispatch } from '../store';
import { fetchProfile, logout, setToken } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const loadUser = useCallback(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token, user]);

  const handleLogin = useCallback(
    (accessToken: string) => {
      dispatch(setToken(accessToken));
      dispatch(fetchProfile());
    },
    [dispatch]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    isManager: user?.isManager ?? false,
    login: handleLogin,
    logout: handleLogout,
  };
};

export default useAuth;

