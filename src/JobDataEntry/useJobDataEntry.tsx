import React from "react";
import { useDispatch } from "react-redux";

import { setSummary } from "../redux/features/jobDataEntry";
import { Form } from "./SharedTypes";

const useJobDataEntry = (serviceForm : Form) => {
	const dispatch = useDispatch();
	const { summary } = serviceForm;
	
	summary && dispatch(setSummary(summary));

	console.log('Running custom JDE hook...')
}

export default useJobDataEntry;