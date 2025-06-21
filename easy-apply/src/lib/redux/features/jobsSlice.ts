import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Job } from '@/types/job';

interface JobsState {
  jobs: Job[];
  jobsByWebsite: { [website: string]: Job[] };
  loadingWebsites: { [website: string]: boolean };
  isLoading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  jobsByWebsite: {},
  loadingWebsites: {},
  isLoading: false,
  error: null,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
      state.error = null;
    },
    addJobsForWebsite: (state, action: PayloadAction<{ website: string; jobs: Job[] }>) => {
      const { website, jobs } = action.payload;
      state.jobsByWebsite[website] = jobs;
      // Mettre à jour la liste complète des jobs
      const allJobs = Object.values(state.jobsByWebsite).flat();
      state.jobs = allJobs;
      state.error = null;
    },
    setWebsiteLoading: (state, action: PayloadAction<{ website: string; loading: boolean }>) => {
      const { website, loading } = action.payload;
      state.loadingWebsites[website] = loading;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearJobs: (state) => {
      state.jobs = [];
      state.jobsByWebsite = {};
      state.loadingWebsites = {};
      state.error = null;
    },
  },
});

export const { setJobs, addJobsForWebsite, setWebsiteLoading, setLoading, setError, clearJobs } = jobsSlice.actions;
export default jobsSlice.reducer; 