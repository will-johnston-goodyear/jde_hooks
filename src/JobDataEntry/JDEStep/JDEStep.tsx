// Global Imports
import * as React from 'react';

// Local Imports
import {JDEStepWrapper, StepHeader } from './JDEStep.style';
import { Step, JDEJob as JDEJobType } from '../SharedTypes';

import { JDEJob } from '../JDEJob/JDEJob';

interface Props {
	step: Step;
	jobs: JDEJobType[] | undefined,
}

export const JDEStep = ({ step, jobs }: Props) => {

const { name : stepName } = step;

	return (
<JDEStepWrapper>
	<StepHeader>
		<h2>STEP LAYER</h2>
		<h2>{stepName}</h2>			
				{jobs && jobs.map((job: JDEJobType) => <JDEJob job={job} key={`job-${job.id}`} />)}
	</StepHeader>
</JDEStepWrapper>
)
}