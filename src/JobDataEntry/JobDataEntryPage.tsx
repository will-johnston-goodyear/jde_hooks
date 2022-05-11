import React from "react";

import useJobDataEntry from "./useJobDataEntry";
import JDEHeader from "./JDEHeader/JDEHeader";

import { serviceForm } from './ServiceForm';

import { FormProvider } from "react-hook-form";

const JobDataEntryPage = (): React.ReactElement => {

	const { formMethods } = useJobDataEntry(serviceForm);
	
	return (
		<FormProvider {...formMethods}>
			<JDEHeader />
			<form>

			</form>
		</FormProvider>
	)
};

export default JobDataEntryPage;
