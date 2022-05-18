import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { setSummary, selectCurrentStepIndex } from "../redux/features/jobDataEntry";
import { Form, JDEElementIndexPropertiesEnum, JDEJob, Step } from "./SharedTypes";
import { getFlatJDEElement } from "./JDEUtils";

import { useForm } from "react-hook-form";

const useJobDataEntry = (serviceForm : Form) => {
	
	const dispatch = useDispatch();
	const { summary, steps } = serviceForm;
	const [shownStep, setShownStep] = React.useState<Step | undefined>(undefined);

	// Dispatch Form.summary to Redux state
	summary && dispatch(setSummary(summary));

	const currentStepIndex = useSelector((state: any) => selectCurrentStepIndex(state));

	React.useEffect(() => {
		if (steps) {
			const targetStep: Step | undefined = steps.find((step: Step) => step.orderIdx == step.orderIdx);
			setShownStep(() => targetStep);
		}
	},[steps, currentStepIndex])

	const formMethods = useForm<any>({
		mode: 'onChange',
	});

	return {
		formMethods,
		shownStep
	}

}

export default useJobDataEntry;