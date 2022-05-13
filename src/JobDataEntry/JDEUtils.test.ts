import { getConditionalJobs, getFlatJDEElement } from "./JDEUtils";

import { serviceForm }  from './ServiceForm';
import { Step, JDEJob, JobCTQuestion, JDEElementIndexPropertiesEnum, JDETask, JDEQuestion, JDEOption } from "./SharedTypes";

describe('getFlatJDEElement tests', () => {
	it('Should return the correctly flattened elements, get jobs from steps', () => {
		const { steps } = serviceForm;
		const flattenedParentElement = [steps[0],steps[1]];
		const correctFlattenedChildElement = [...flattenedParentElement[0].jobs, ...flattenedParentElement[1].jobs];

		const result = getFlatJDEElement<Step, JDEJob>(flattenedParentElement, JDEElementIndexPropertiesEnum.JDEJOB);
		expect(result).toEqual(correctFlattenedChildElement);
	})

	it('Should return the correctly flattened elements, get tasks from jobs', () => {
		const { steps } = serviceForm;
		const jobs = getFlatJDEElement<Step, JDEJob>(steps, JDEElementIndexPropertiesEnum.JDEJOB);

		const flattenedParentElement = [jobs[0], jobs[1]];
		const correctFlattenedChildElement = [...flattenedParentElement[0].tasks,...flattenedParentElement[1].tasks]

		const result = getFlatJDEElement<JDEJob, JDETask>(flattenedParentElement, JDEElementIndexPropertiesEnum.JDETask);
		expect(result).toEqual(correctFlattenedChildElement);
	})

	it('Should return the correctly flattened elements, get questions from tasks', () => {
		const { steps } = serviceForm;
		const jobs = getFlatJDEElement<Step, JDEJob>(steps, JDEElementIndexPropertiesEnum.JDEJOB);
		const tasks = getFlatJDEElement<JDEJob, JDETask>(jobs, JDEElementIndexPropertiesEnum.JDETask);

		const flattenedParentElement = [tasks[0], tasks[1]];
		const correctFlattenedChildElement = [...flattenedParentElement[0].questions, ...flattenedParentElement[1].questions];
		const result = getFlatJDEElement<JDETask, JDEQuestion>(flattenedParentElement, JDEElementIndexPropertiesEnum.JDEQuestion);
		expect(result).toEqual(correctFlattenedChildElement);
	})

		it('Should return the correctly flattened elements, get options from questions', () => {
		const { steps } = serviceForm;
		const jobs = getFlatJDEElement<Step, JDEJob>(steps, JDEElementIndexPropertiesEnum.JDEJOB);
		const tasks = getFlatJDEElement<JDEJob, JDETask>(jobs, JDEElementIndexPropertiesEnum.JDETask);
		const questions = getFlatJDEElement<JDETask, JDEQuestion>(tasks, JDEElementIndexPropertiesEnum.JDEQuestion);
		
		const flattenedParentElement = [questions[0], questions[1]];
		const correctFlattenedChildElement = [...flattenedParentElement[0].options ?? [], ...flattenedParentElement[1].options ?? []];
		const result = getFlatJDEElement<JDEQuestion, JDEOption>(flattenedParentElement, JDEElementIndexPropertiesEnum.JDEQuestion);
		expect(result).toEqual(correctFlattenedChildElement);
	})
})

describe('getConditionalJobs tests', () => {
	it('Should return the correct vehicle details contingent jobs', () => {
		const { steps } = serviceForm;
		const correctConditionalJobs = [...steps[2].jobs];
		const jobs = getFlatJDEElement<Step, JDEJob>(steps, JDEElementIndexPropertiesEnum.JDEJOB);
		expect(getConditionalJobs(jobs)).toEqual(correctConditionalJobs);
	})

	it('Should return the correct questions contingent jobs', () => {
		const { steps } = serviceForm;

		const jobCTQuestion: JobCTQuestion = {
			...steps[0].jobs[0].tasks[0].questions[0],
			conditionalJobQuestionId: '1',
			jobRenderedByMax: 1,
			jobRenderedByMin: 1,
			jobRenderedByOptionIds: ['1',]
		}

		const updatedJob: JDEJob = {
			...steps[0].jobs[0],
			renderedByQuestions: [jobCTQuestion]
		};

		const updatedStep = {
			...steps[0],
			jobs: [
				updatedJob
			]
		}

		const correctContingentJobs = [...updatedStep.jobs];
		const jobs = getFlatJDEElement<Step, JDEJob>([updatedStep],JDEElementIndexPropertiesEnum.JDEJOB);
		expect(getConditionalJobs(jobs)).toEqual(correctContingentJobs);
	})
});