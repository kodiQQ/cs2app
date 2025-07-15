import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithAuth } from '../../api/apiClient';

export const fetchCases = createAsyncThunk('cases/fetchAll', async () => {
    const data = await fetchWithAuth('/cases/', { method: 'GET' }, 'fetchCases');
    return data;
});