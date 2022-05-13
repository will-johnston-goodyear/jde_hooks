// Global Imports
import * as React from 'react';

// Local Imports
import {JDEJobWrapper} from './JDEJob.style';
import { JDEJob as JDEJobType, JDETask as JDETaskType } from '../SharedTypes'
import { JDETask } from '../JDETask/JDETask'

interface Props {
	job: JDEJobType
}

// eslint-disable-next-line no-empty-pattern
export const JDEJob = ({job}: Props) => {

const { tasks, id } = job;

return (
<JDEJobWrapper>
	<h3>JOB Layer</h3>
		{tasks.map((task: JDETaskType) => <JDETask task={task} key={`task-${task.id}`}/>)}
</JDEJobWrapper>
)
}