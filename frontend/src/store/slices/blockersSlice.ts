import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { blockersApi } from '../../services/api';
import { BlockersState, Blocker, BlockerStats } from '../../types';

const initialState: BlockersState = {
  blockers: [],
  stats: null,
  isLoading: false,
  error: null,
  total: 0,
};

export const fetchMyBlockers = createAsyncThunk(
  'blockers/fetchMy',
  async (params: Record<string, unknown> | undefined, { rejectWithValue }) => {
    try {
      const response = await blockersApi.getMy(params);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch blockers');
    }
  }
);

export const fetchMyStats = createAsyncThunk(
  'blockers/fetchMyStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await blockersApi.getMyStats();
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch stats');
    }
  }
);

export const fetchTeamBlockers = createAsyncThunk(
  'blockers/fetchTeam',
  async (
    { teamName, params }: { teamName: string; params?: Record<string, unknown> },
    { rejectWithValue }
  ) => {
    try {
      const response = await blockersApi.getByTeam(teamName, params);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch team blockers');
    }
  }
);

export const fetchTeamStats = createAsyncThunk(
  'blockers/fetchTeamStats',
  async (teamName: string, { rejectWithValue }) => {
    try {
      const response = await blockersApi.getTeamStats(teamName);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch team stats');
    }
  }
);

export const createBlocker = createAsyncThunk(
  'blockers/create',
  async (data: Record<string, unknown>, { rejectWithValue }) => {
    try {
      const response = await blockersApi.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create blocker');
    }
  }
);

export const updateBlocker = createAsyncThunk(
  'blockers/update',
  async (
    { id, data }: { id: string; data: Record<string, unknown> },
    { rejectWithValue }
  ) => {
    try {
      const response = await blockersApi.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update blocker');
    }
  }
);

const blockersSlice = createSlice({
  name: 'blockers',
  initialState,
  reducers: {
    clearBlockers: (state) => {
      state.blockers = [];
      state.total = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Blockers
      .addCase(fetchMyBlockers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyBlockers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blockers = action.payload.blockers;
        state.total = action.payload.total;
      })
      .addCase(fetchMyBlockers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch My Stats
      .addCase(fetchMyStats.fulfilled, (state, action: PayloadAction<BlockerStats>) => {
        state.stats = action.payload;
      })
      // Fetch Team Blockers
      .addCase(fetchTeamBlockers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeamBlockers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blockers = action.payload.blockers;
        state.total = action.payload.total;
      })
      .addCase(fetchTeamBlockers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Team Stats
      .addCase(fetchTeamStats.fulfilled, (state, action: PayloadAction<BlockerStats>) => {
        state.stats = action.payload;
      })
      // Create Blocker
      .addCase(createBlocker.fulfilled, (state, action: PayloadAction<Blocker>) => {
        state.blockers.unshift(action.payload);
        state.total += 1;
      })
      // Update Blocker
      .addCase(updateBlocker.fulfilled, (state, action: PayloadAction<Blocker>) => {
        const index = state.blockers.findIndex((b) => b.uid === action.payload.uid);
        if (index !== -1) {
          state.blockers[index] = action.payload;
        }
      });
  },
});

export const { clearBlockers, clearError } = blockersSlice.actions;
export default blockersSlice.reducer;

