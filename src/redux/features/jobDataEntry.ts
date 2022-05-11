import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Summary } from '../../JobDataEntry/SharedTypes';


interface JDEState {
	summary: Partial<Summary> | null;

}

const initialState : JDEState = { summary : null };

const jobDataEntrySlice = createSlice({
	name: 'jobDataEntry',
	initialState,
	reducers: {
		setSummary(state, action: PayloadAction<Partial<Summary>>) {
			state.summary = action.payload;
		}
	}
})

export const { setSummary } = jobDataEntrySlice.actions;
export default jobDataEntrySlice.reducer;