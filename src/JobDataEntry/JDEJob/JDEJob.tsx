// Global Imports
import * as React from 'react';
import { useWatch, useFormContext } from 'react-hook-form';

import isEmpty from 'lodash/isEmpty'

// Local Imports
import {JDEJobWrapper} from './JDEJob.style';
import { ConditionalJobActionEnum, JDEJob as JDEJobType, JDEOption, JDETask as JDETaskType, JobCTQuestion } from '../SharedTypes'
import { JDETask } from '../JDETask/JDETask'
import { JDEQuestion } from '../JDEQuestion/JDEQuestion'
import { isRenderedByQuestionsContingencyFulfilled } from '../JDEUtils';

interface Props {
	job: JDEJobType
}

// eslint-disable-next-line no-empty-pattern
export const JDEJob = ({job}: Props) : React.ReactElement => {

const { tasks, renderedByQuestions, conditionalJobAction } = job;
const isRenderedByQuestions = !isEmpty(renderedByQuestions);
const { control } = useFormContext();

const [isQuestionContingencyFulfilled, setIsQuestionContingencyFulfilled] = React.useState(true);
	
/**
 * Creates a dictionary of answer strings for all `JobCTQuestions` 
 */
const jobCTQuestionAnswers = renderedByQuestions?.map((jobCTQuestion: JobCTQuestion) => (useWatch({
		control,
		name: jobCTQuestion.id
})));

/**
 * Listens for changes to the JobCTQuestions answers and updates `isQuestionContingencyFulfilled` local state on changes
 */
React.useEffect(() => {
	setIsQuestionContingencyFulfilled(isRenderedByQuestionsContingencyFulfilled(renderedByQuestions ?? [], jobCTQuestionAnswers ?? [''], conditionalJobAction ?? ConditionalJobActionEnum.SHOW_ALL))
},[jobCTQuestionAnswers])

return (
<JDEJobWrapper>
	<h3>JOB Layer</h3>
	{isRenderedByQuestions && <span>Job is rendered by questions</span>}
		{isRenderedByQuestions && renderedByQuestions?.map((jobCTQuestion: JobCTQuestion) => <JDEQuestion question={jobCTQuestion} />)}	
	{isQuestionContingencyFulfilled && tasks.map((task: JDETaskType) => <JDETask task={task} key={`task-${task.id}`}/>)}
</JDEJobWrapper>
)
}