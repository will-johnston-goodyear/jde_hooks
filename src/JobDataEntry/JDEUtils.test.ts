import { getFlatJDEElement, getConditionalElements, isVehicleDetailsContingencyFulfilled, areMakeModelYearsMatched } from "./JDEUtils";

import { serviceForm }  from './ServiceForm';
import { Step, JDEJob, JobCTQuestion, JDEElementIndexPropertiesEnum, JDETask, JDEQuestion, JDEOption, CTSystemDetail, ArtificialCTSystemDetail, ConditionalJobActionEnum, DriveTypeEnum, MakeModelYear } from "./SharedTypes";

describe('getFlatJDEElement tests', () => {
	it('Should return the correctly flattened elements, get jobs from steps', () => {
		const { steps } = serviceForm;
		const flattenedParentElement = [steps[0], steps[1]];
		const correctFlattenedChildElement = [...flattenedParentElement[0].jobs, ...flattenedParentElement[1].jobs];

		const result = getFlatJDEElement<Step, JDEJob>(flattenedParentElement, JDEElementIndexPropertiesEnum.JDEJOB);
		expect(result).toEqual(correctFlattenedChildElement);
	})

	it('Should return the correctly flattened elements, get tasks from jobs', () => {
		const { steps } = serviceForm;
		const jobs = getFlatJDEElement<Step, JDEJob>(steps, JDEElementIndexPropertiesEnum.JDEJOB);

		const flattenedParentElement = [jobs[0], jobs[1]];
		const correctFlattenedChildElement = [...flattenedParentElement[0].tasks, ...flattenedParentElement[1].tasks]

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
});

describe('getConditionalElements tests', () => {
	/* 
		Contingencies Types Checked 
		[X] - `renderedByQuestions`
		[X] - `renderedByVehicleDetails`
		[X] - `renderedByVehicleDetailsArtificial`
		[X] - `renderedByOptionIds` 
		[X] - `renderedByMin` 
		[X] - `renderedByMax`
		[X] - `renderedByDriveTypes` 
	*/
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

		const correctContingentElements = [...updatedStep.jobs];
		const jobs = getFlatJDEElement<Step, JDEJob>([updatedStep], JDEElementIndexPropertiesEnum.JDEJOB);
		expect(getConditionalElements(jobs)).toEqual(correctContingentElements);
	});

	it('Should return the correct vehicle details contingent jobs', () => {
		const { steps } = serviceForm;
		const correctContingentElements = [...steps[2].jobs];
		const jobs = getFlatJDEElement<Step, JDEJob>(steps, JDEElementIndexPropertiesEnum.JDEJOB);
		expect(getConditionalElements(jobs)).toEqual(correctContingentElements);
	});

	it('Should return the correct artificial details contingnet jobs', () => {
		const { steps } = serviceForm;
		
		const artificialVehicleDetailsContingency: ArtificialCTSystemDetail = {
			id: "1",
			orderIdx: 2,
			companyId: null,
			makeModelYear: null,
			driveType: null,
			mileageMinValue: null,
			mileageMaxValue: null,
			isRotational: null,
			tireSizes: null,
			vehiclePowertrain: null,
			vehicleStatuses: null,
			conditionalJobAction: ConditionalJobActionEnum.SHOW_ALL,
			tirePsis: ["33"],
			grooveCounts: ["3"],
			wheelTorques: ["4"],
		}
		
		const updatedJob: JDEJob = {
			...steps[0].jobs[0],
			renderedByVehicleDetailsArtificial: [artificialVehicleDetailsContingency]
		}

		const updatedStep = {
			...steps[0],
			jobs: [updatedJob]
		}

		const correctContingentElements = [...updatedStep.jobs];
		const jobs = getFlatJDEElement<Step, JDEJob>([updatedStep,steps[0]], JDEElementIndexPropertiesEnum.JDEJOB);
		expect(getConditionalElements(jobs)).toEqual(correctContingentElements)
	});

	it('Should return the correct option ids contingent questions', () => {
		const { steps } = serviceForm;
		const questions = steps[0].jobs[0].tasks[0].questions;

		const updatedQuestion: JDEQuestion = {
			...questions[0],
			renderedByOptionIds: ['001']
		};

		const updatedQuestions = [
			updatedQuestion,
			updatedQuestion,
			...questions
		];

		expect(getConditionalElements(updatedQuestions)).toEqual([updatedQuestion, updatedQuestion]);
	});

	it('Should return the correct rendered by max contingent questions', () => {
		const { steps } = serviceForm;
		const questions = steps[0].jobs[0].tasks[0].questions;

		const updatedQuestion: JDEQuestion = {
			...questions[0],
			renderedByMax: 22
		};

		const updatedQuestions = [
			updatedQuestion,
			updatedQuestion,
			...questions
		];

		expect(getConditionalElements(updatedQuestions)).toEqual([updatedQuestion, updatedQuestion]);
	});

	it('Should return the correct rendered by min contingent questions', () => {
		const { steps } = serviceForm;
		const questions = steps[0].jobs[0].tasks[0].questions;

		const updatedQuestion: JDEQuestion = {
			...questions[0],
			renderedByMin: 22
		};

		const updatedQuestions = [
			updatedQuestion,
			updatedQuestion,
			...questions
		];

		expect(getConditionalElements(updatedQuestions)).toEqual([updatedQuestion, updatedQuestion]);
	});

	it('Should return the correct rendered by drive types contingent tasks', () => {
		const { steps } = serviceForm;
		const tasks = steps[0].jobs[0].tasks;

		const updatedTask: JDETask = {
			...tasks[0],
			renderedByDriveTypes: [DriveTypeEnum.AWD],
		};

		const nonContingentTask : JDETask = {
			...tasks[0],
			renderedByDriveTypes: null,
			renderedByOptionId: null,
			renderedByQuestions: null,
			renderedByVehicleDetails: null,
			renderedByVehicleDetailsArtificial: null,
		}

		const updatedTasks = [
			updatedTask,
			updatedTask,
			nonContingentTask,
		];

		expect(getConditionalElements(updatedTasks)).toEqual([updatedTask, updatedTask]);
	});

})

describe('areMakeModelYearsMatches', () => {
	it('Should return true', () => {
		const makeModelYearConditions: MakeModelYear[] = [
			{
				make: 'Tesla',
				model: 'Model Y',
				year: 2022
			}
		]

		const summaryMakeModelYears: MakeModelYear = {
			make: 'Tesla',
			model: 'Model Y',
			year: 2022
		}

		expect(areMakeModelYearsMatched(makeModelYearConditions, summaryMakeModelYears)).toBe(true);
	})
})

describe('isVehicleDetailsContingencyFulfilled tests', () => {

	it.skip('Should return true', () => {
		
		const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];
		
		console.log(isVehicleDetailsContingencyFulfilled(ctSystemDetail, serviceForm.summary));
	})
})