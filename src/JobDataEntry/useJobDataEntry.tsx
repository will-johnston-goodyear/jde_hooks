import React from "react";
import { useDispatch } from "react-redux";

import { setSummary } from "../redux/features/jobDataEntry";
import { Form, JDEElementIndexPropertiesEnum, JDEJob, Step } from "./SharedTypes";
import { getFlatJDEElement } from "./JDEUtils";

import { useForm } from "react-hook-form";

const useJobDataEntry = (serviceForm : Form) => {
	
	const [flatJobs, setFlatJobs] = React.useState<JDEJob[] | []>([]);

	const dispatch = useDispatch();
	const { summary, steps } = serviceForm;

	// Dispatch Form.summary to Redux state
	summary && dispatch(setSummary(summary));
	
	React.useEffect(() => {
		setFlatJobs(getFlatJDEElement(steps, JDEElementIndexPropertiesEnum.JDEJOB))
	},[serviceForm])


	const formMethods = useForm<any>({
		mode: 'onChange',
	});

	return {
		formMethods
	}

}

export default useJobDataEntry;