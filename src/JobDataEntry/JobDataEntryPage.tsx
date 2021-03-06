import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider } from "react-hook-form";

import useJobDataEntry from "./useJobDataEntry";
import { incrementCurrentStepIndex, decrementCurrentStepIndex, selectCurrentStepIndex } from "../redux/features/jobDataEntry";
import JDEHeader from "./JDEHeader/JDEHeader";

import { serviceForm } from './ServiceForm';
import { VehicleDetailsContingentJobServiceForm } from "./MockServiceForms/VehicleDetailsContingentJob_ServiceForm";
import { QuestionsContingentJobServiceForm } from "./MockServiceForms/QuestionsContingentJob_ServiceForm";

import { JDEStep } from "./JDEStep/JDEStep";
import { Form } from "./SharedTypes";

const JobDataEntryPage = (): React.ReactElement => {

	const [targetServiceForm, setTargetServiceForm] = React.useState<Form>(serviceForm);

	const { formMethods, shownStep, shownJobs } = useJobDataEntry(targetServiceForm);
	const dispatch = useDispatch();
	const currentStepIndex = useSelector((state: any) => selectCurrentStepIndex(state));
	
	const isFirstStep = currentStepIndex === 0;
	const isLastStep = currentStepIndex === serviceForm.steps.length - 1;

	const handleFormSelection = (targetForm: string) => {
		switch (targetForm) {
			case "vehicleDetailsContingentTask":
				setTargetServiceForm(serviceForm);
				break;
			case "vehicleDetailContingentJob":
				setTargetServiceForm(VehicleDetailsContingentJobServiceForm);
				break;
			case "questionContingentJob":
				setTargetServiceForm(QuestionsContingentJobServiceForm);
				break;
			default:
				setTargetServiceForm(serviceForm);
				break;
		}
	}

	return (
		<FormProvider {...formMethods}>
			<JDEHeader />
			<form>
				{shownStep && <JDEStep step={shownStep} key={`step-${shownStep.id}`} jobs={shownJobs} />}
			</form>
			<button onClick={() => console.log(formMethods.getValues())}>See Values</button>
			{!isLastStep && <button onClick={() => dispatch(incrementCurrentStepIndex())}>Next Step</button>}
			{!isFirstStep && <button onClick={() => dispatch(decrementCurrentStepIndex())}>Previous Step</button>}
			<select onChange={(e) => handleFormSelection(e.target.value)}>
				<option value={"vehicleDetailContingentJob"}>Condtional Job - Rendered By Vehicle Details - Make Model Year</option>
				<option value={"questionContingentJob"}>Conditional Job - Rendered by Questions - Show if All "Yes"</option>
				<option value={"vehicleDetailsContingentTask"}>Conditional Task - Rendered By Vehicle Details - Make Model Year</option>
			</select>
		</FormProvider>
	)
};

export default JobDataEntryPage;
