import React from "react";
import { useDispatch } from "react-redux";

import { setSummary } from "../redux/features/jobDataEntry";
import { Form } from "./SharedTypes";

import { useForm } from "react-hook-form";

const useJobDataEntry = (serviceForm : Form) => {
	const dispatch = useDispatch();
	const { summary } = serviceForm;
	
	// Dispatch Form.summary to Redux state
	summary && dispatch(setSummary(summary));

	const formMethods = useForm<any>();

	return {
		formMethods,
	}

}

export default useJobDataEntry;