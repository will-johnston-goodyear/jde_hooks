// Global Imports
import * as React from 'react';

// Local Imports
import {JDEStepWrapper, StepHeader } from './JDEStep.style';
import { Step, JDEJob as JDEJobType } from '../SharedTypes';

import { JDEJob } from '../JDEJob/JDEJob';

interface Props {
	step: Step;
}

export const JDEStep = ({ step }: Props) => {

const { name : stepName, jobs } = step;

	return (
<JDEStepWrapper>
	<StepHeader>
		<h2>{stepName}</h2>			
				{jobs.map((job: JDEJobType) => <JDEJob job={job} />)}
	</StepHeader>
</JDEStepWrapper>
)
}