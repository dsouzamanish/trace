import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { aiReportsApi } from '../../services/api';
import { AiReportsState, AiReport } from '../../types';

const initialState: AiReportsState = {
  reports: [],
  currentReport: null,
  isLoading: false,
  isGenerating: false,
  error: null,
};

export const fetchMyReports = createAsyncThunk(
  'aiReports/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiReportsApi.getMy();
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch reports');
    }
  }
);

export const fetchTeamReports = createAsyncThunk(
  'aiReports/fetchTeam',
  async (teamName: string, { rejectWithValue }) => {
    try {
      const response = await aiReportsApi.getForTeam(teamName);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch team reports');
    }
  }
);

export const generateMyReport = createAsyncThunk(
  'aiReports/generateMy',
  async (period: 'weekly' | 'monthly' = 'weekly', { rejectWithValue }) => {
    try {
      const response = await aiReportsApi.generateMy(period);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to generate report');
    }
  }
);

export const generateTeamReport = createAsyncThunk(
  'aiReports/generateTeam',
  async (
    { teamName, period }: { teamName: string; period: 'weekly' | 'monthly' },
    { rejectWithValue }
  ) => {
    try {
      const response = await aiReportsApi.generateForTeam(teamName, period);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to generate team report');
    }
  }
);

export const fetchReportById = createAsyncThunk(
  'aiReports/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await aiReportsApi.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch report');
    }
  }
);

const aiReportsSlice = createSlice({
  name: 'aiReports',
  initialState,
  reducers: {
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Reports
      .addCase(fetchMyReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyReports.fulfilled, (state, action: PayloadAction<AiReport[]>) => {
        state.isLoading = false;
        state.reports = action.payload;
      })
      .addCase(fetchMyReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Team Reports
      .addCase(fetchTeamReports.fulfilled, (state, action: PayloadAction<AiReport[]>) => {
        state.reports = action.payload;
      })
      // Generate My Report
      .addCase(generateMyReport.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateMyReport.fulfilled, (state, action: PayloadAction<AiReport>) => {
        state.isGenerating = false;
        state.currentReport = action.payload;
        
        // Only add to list if it's a new report (not an existing cached one)
        // Check by uid to avoid duplicates
        const existingIndex = state.reports.findIndex(r => r.uid === action.payload.uid);
        if (existingIndex === -1) {
          // New report - add to beginning
          state.reports.unshift(action.payload);
        } else if (action.payload.isExisting) {
          // Existing report returned - update it in place (in case data changed)
          state.reports[existingIndex] = action.payload;
        }
      })
      .addCase(generateMyReport.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload as string;
      })
      // Generate Team Report
      .addCase(generateTeamReport.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateTeamReport.fulfilled, (state, action: PayloadAction<AiReport>) => {
        state.isGenerating = false;
        state.currentReport = action.payload;
        
        // Only add to list if it's a new report (not an existing cached one)
        // Check by uid to avoid duplicates
        const existingIndex = state.reports.findIndex(r => r.uid === action.payload.uid);
        if (existingIndex === -1) {
          // New report - add to beginning
          state.reports.unshift(action.payload);
        } else if (action.payload.isExisting) {
          // Existing report returned - update it in place (in case data changed)
          state.reports[existingIndex] = action.payload;
        }
      })
      .addCase(generateTeamReport.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload as string;
      })
      // Fetch Report By ID
      .addCase(fetchReportById.fulfilled, (state, action: PayloadAction<AiReport>) => {
        state.currentReport = action.payload;
      });
  },
});

export const { clearCurrentReport, clearError } = aiReportsSlice.actions;
export default aiReportsSlice.reducer;

