import React from "react";

import useJobDataEntry from "./useJobDataEntry";
import JDEHeader from "./JDEHeader/JDEHeader";

import { serviceForm } from './ServiceForm';

import { FormProvider } from "react-hook-form";
import { JDEStep } from "./JDEStep/JDEStep";

import { Step } from "./SharedTypes";

const JobDataEntryPage = (): React.ReactElement => {

	const { formMethods } = useJobDataEntry(serviceForm);

	const { steps } = serviceForm;
	
	return (
		<FormProvider {...formMethods}>
			<JDEHeader />
			<form>
				{steps.map((step: Step) => <JDEStep step={step} key={`step-${step.id}`}/>)}
			</form>
			<button onClick={() => console.log(formMethods.getValues())}>See Values</button>
		</FormProvider>
	)
};

export default JobDataEntryPage;
