import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider } from "react-hook-form";

import useJobDataEntry from "./useJobDataEntry";
import { incrementCurrentStepIndex, decrementCurrentStepIndex, selectCurrentStepIndex } from "../redux/features/jobDataEntry";
import JDEHeader from "./JDEHeader/JDEHeader";

import { serviceForm } from './ServiceForm';

import { JDEStep } from "./JDEStep/JDEStep";

const JobDataEntryPage = (): React.ReactElement => {
	const { formMethods, shownStep } = useJobDataEntry(serviceForm);
	const dispatch = useDispatch();
	const currentStepIndex = useSelector((state: any) => selectCurrentStepIndex(state));
	
	const isFirstStep = currentStepIndex === 0;
	const isLastStep = currentStepIndex === serviceForm.steps.length - 1;

	return (
		<FormProvider {...formMethods}>
			<JDEHeader />
			<form>
				{shownStep && <JDEStep step={shownStep} key={`step-${shownStep.id}`}/>}
			</form>
			<button onClick={() => console.log(formMethods.getValues())}>See Values</button>
			{!isLastStep && <button onClick={() => dispatch(incrementCurrentStepIndex())}>Next Step</button>}
			{!isFirstStep && <button onClick={() => dispatch(decrementCurrentStepIndex())}>Previous Step</button>}
		</FormProvider>
	)
};

export default JobDataEntryPage;
