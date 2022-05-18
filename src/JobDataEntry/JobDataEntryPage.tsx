import React from "react";

import useJobDataEntry from "./useJobDataEntry";
import JDEHeader from "./JDEHeader/JDEHeader";

import { serviceForm } from './ServiceForm';

import { FormProvider } from "react-hook-form";
import { JDEStep } from "./JDEStep/JDEStep";

import { Step } from "./SharedTypes";

const JobDataEntryPage = (): React.ReactElement => {
	const { formMethods, shownStep } = useJobDataEntry(serviceForm);
	console.log(shownStep)
	return (
		<FormProvider {...formMethods}>
			<JDEHeader />
			<form>
				{shownStep && <JDEStep step={shownStep} key={`step-${shownStep.id}`}/>}
			</form>
			<button onClick={() => console.log(formMethods.getValues())}>See Values</button>
		</FormProvider>
	)
};

export default JobDataEntryPage;
