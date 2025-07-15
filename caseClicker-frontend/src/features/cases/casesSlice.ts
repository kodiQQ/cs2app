import { createSlice } from '@reduxjs/toolkit';
import { fetchCases } from './casesThunks';

interface CasesState {
    list: any[];
    loading: boolean;
    error: string | null;
}

const initialState: CasesState = { list: [], loading: false, error: null };

export const casesSlice = createSlice({
    name: 'cases',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCases.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchCases.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
            .addCase(fetchCases.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
    },
});

export default casesSlice.reducer;
