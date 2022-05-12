// Global Imports
import * as React from 'react';

// Local Imports
import {JDEJobWrapper} from './JDEJob.style';
import { JDEJob as JDEJobType } from '../SharedTypes'

interface Props {
	job: JDEJobType
}

// eslint-disable-next-line no-empty-pattern
export const JDEJob = ({job}: Props) => {

const { tasks } = job;

return (
<JDEJobWrapper>
	<span>JOB Layer</span>
</JDEJobWrapper>
)
}