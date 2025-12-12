import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { RootState, AppDispatch } from '../store';
import {
  fetchMyBlockers,
  fetchMyStats,
  fetchTeamBlockers,
  fetchTeamStats,
  createBlocker,
  updateBlocker,
} from '../store/slices/blockersSlice';

export const useBlockers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { blockers, stats, isLoading, error, total } = useSelector(
    (state: RootState) => state.blockers
  );

  const loadMyBlockers = useCallback(
    (params?: Record<string, unknown>) => {
      dispatch(fetchMyBlockers(params));
    },
    [dispatch]
  );

  const loadMyStats = useCallback(() => {
    dispatch(fetchMyStats());
  }, [dispatch]);

  const loadTeamBlockers = useCallback(
    (teamName: string, params?: Record<string, unknown>) => {
      dispatch(fetchTeamBlockers({ teamName, params }));
    },
    [dispatch]
  );

  const loadTeamStats = useCallback(
    (teamName: string) => {
      dispatch(fetchTeamStats(teamName));
    },
    [dispatch]
  );

  const addBlocker = useCallback(
    (data: Record<string, unknown>) => {
      return dispatch(createBlocker(data));
    },
    [dispatch]
  );

  const editBlocker = useCallback(
    (id: string, data: Record<string, unknown>) => {
      return dispatch(updateBlocker({ id, data }));
    },
    [dispatch]
  );

  return {
    blockers,
    stats,
    isLoading,
    error,
    total,
    loadMyBlockers,
    loadMyStats,
    loadTeamBlockers,
    loadTeamStats,
    addBlocker,
    editBlocker,
  };
};

export default useBlockers;

