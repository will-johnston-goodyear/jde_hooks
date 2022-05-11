import React from "react";

import useJobDataEntry from "./useJobDataEntry";

import { serviceForm } from './ServiceForm';

const JobDataEntryPage = (): React.ReactElement => {

	React.useMemo(() => useJobDataEntry(serviceForm), [serviceForm]);

  return <span>JobDataEntryPage</span>;
};

export default JobDataEntryPage;
