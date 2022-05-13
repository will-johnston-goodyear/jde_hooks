// Global Imports
import * as React from 'react';

// Local Imports
import {JDETaskWrapper} from './JDETask.style';
import { JDETask as JDETaskType, JDEQuestion as JDEQuestionType } from '../SharedTypes';
import { JDEQuestion } from '../JDEQuestion/JDEQuestion'

interface Props {
	task : JDETaskType
}

export const JDETask = ({ task }: Props) => {

const { name, questions } = task; 

return(
<JDETaskWrapper>
		<h4>TASK LAYER</h4>
		<h4>Task Name: {name}</h4>
		{questions.map((question: JDEQuestionType) => <JDEQuestion question={question} key={question.id}/>)}
</JDETaskWrapper>
)
}