import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { number } from "yup";

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

export interface HeaderContent {
	companyName: string;
	vin: string;
}

export const selectHeaderContent = (state: any): HeaderContent => {
	const { companyName, vin } = state.jobDataEntry.summary;

	return { 
		companyName,
		vin
	}
} 

export const { setSummary } = jobDataEntrySlice.actions;
export default jobDataEntrySlice.reducer;