import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { number } from "yup";

import { Summary } from '../../JobDataEntry/SharedTypes';


interface JDEState {
	summary: Partial<Summary> | null;
	currentStepIndex: number;
}

const initialState: JDEState = {
	summary: null,
	currentStepIndex: 0,
};

const jobDataEntrySlice = createSlice({
	name: 'jobDataEntry',
	initialState,
	reducers: {
		setSummary(state, action: PayloadAction<Partial<Summary>>) {
			state.summary = action.payload;
		},
		incrementCurrentStepIndex(state) {
			state.currentStepIndex++;
		},
		decrementCurrentStepIndex(state) {
			state.currentStepIndex > 0 &&
				state.currentStepIndex--;
			
			state.currentStepIndex <= 0 &&
				state.currentStepIndex
		},
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

export const selectCurrentStepIndex = (state: any): number => {
	return state.jobDataEntry.currentStepIndex;
}

export const { setSummary, incrementCurrentStepIndex, decrementCurrentStepIndex} = jobDataEntrySlice.actions;
export default jobDataEntrySlice.reducer;