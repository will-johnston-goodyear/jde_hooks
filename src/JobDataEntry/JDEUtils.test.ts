import { getFlatJDEElement, getConditionalElements, isVehicleDetailsContingencyFulfilled, areMakeModelYearsMatched, isMileageValueMatched, doTireSizesMatch, getShownJobs, isRenderedByQuestionsContingencyFulfilled, isRenderedByOptionIdFulfilled } from "./JDEUtils";

import { serviceForm }  from './ServiceForm';
import { VehicleDetailsContingentJobServiceForm } from './MockServiceForms/VehicleDetailsContingentJob_ServiceForm'
import { QuestionsContingentJobServiceForm } from './MockServiceForms/QuestionsContingentJob_ServiceForm'
import { Step, JDEJob, JobCTQuestion, JDEElementIndexPropertiesEnum, JDETask, JDEQuestion, JDEOption, CTSystemDetail, ArtificialCTSystemDetail, ConditionalJobActionEnum, DriveTypeEnum, MakeModelYear, Summary, VehiclePowertrainEnum, VehicleStatusEnum } from "./SharedTypes";

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

	it('Should return false', () => {
		const makeModelYearConditions: MakeModelYear[] = [
			{
				make: 'Tesla',
				model: 'Model Y',
				year: 2022
			}
		]

		const summaryMakeModelYears: MakeModelYear = {
			make: 'Dodge',
			model: 'GLH Turbo',
			year: 1896
		}

		expect(areMakeModelYearsMatched(makeModelYearConditions, summaryMakeModelYears)).toBe(false);
	})

		it('Should return true', () => {
		const makeModelYearConditions: MakeModelYear[] = [
			{
				make: 'Tesla',
				model: 'Model Y',
				year: 2022
			},
			{
				make: 'Dodge',
				model: 'GLH Turbo',
				year: 1986
			}
		]

		const summaryMakeModelYears: MakeModelYear = {
			make: 'Dodge',
			model: 'GLH Turbo',
			year: 1896
		}

		expect(areMakeModelYearsMatched(makeModelYearConditions, summaryMakeModelYears)).toBe(false);
	})
})

describe('isMileageValueMatched tests', () => {
	it('Should return true when conditonal value is greater than summary value', () => {
		const conditionalKey = "mileageMaxValue";
		const conditionalValue = 201;
		const summaryValue = 200;

		expect(isMileageValueMatched(conditionalKey, conditionalValue, summaryValue)).toBe(true);
	})

	it('Should return true when conditional value is equal to summary value', () => {
		const conditionalKey = "mileageMaxValue";
		const conditionalValue = 200;
		const summaryValue = 200;

		expect(isMileageValueMatched(conditionalKey, conditionalValue, summaryValue)).toBe(true);
	})

	it('Should return true when conditional value is greater than summary value', () => {
		const conditionalKey = "mileageMinValue";
		const conditionalValue = 200;
		const summaryValue = 199;

		expect(isMileageValueMatched(conditionalKey, conditionalValue, summaryValue)).toBe(true);
	})

	it('Should return true when conditional value is equal to summary value', () => {
		const conditionalKey = "mileageMinValue";
		const conditionalValue = 200;
		const summaryValue = 200;

		expect(isMileageValueMatched(conditionalKey, conditionalValue, summaryValue)).toBe(true);
	})
	
	it('Should return false when conditional value is less than summary value', () => {
		const conditionalKey = "mileageMinValue";
		const conditionalValue = 199;
		const summaryValue = 200;

		expect(isMileageValueMatched(conditionalKey, conditionalValue, summaryValue)).toBe(false);
	})
})

describe('doTireSizesMatch tests', () => {
	it('Should return true when all values match', () => {
		expect(doTireSizesMatch(["1", "2"], ["1", "2"])).toEqual(true);
	});

	it('Should return false when no values match', () => {
		expect(doTireSizesMatch(["1", "2"], ["3","4"])).toBe(false);
	})

	it('Should return true when any summary value matches any CTSystemDetails.tireSizes values', () => {
		expect(doTireSizesMatch(["1", "2"], ["1", "3"])).toBe(true);
		expect(doTireSizesMatch(["1", "2"], ["3", "2"])).toBe(true);
	})
})

describe('isVehicleDetailsContingencyFulfilled tests', () => {
	
	it('Should return true when ctSystemDetail.companyId matches summary.companyId', () => {
		
		// MakeModelYear
		const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];

		const updatedCtSystemDetail : CTSystemDetail = {
			...ctSystemDetail,
			makeModelYear: null,
			companyId: ["Will Corp."],
		}
		const updatedSummary = {
			...serviceForm.summary,
			companyId: "Will Corp."
		};
		
		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, updatedSummary)).toBe(true);
	});
	
	it('Should return true when ctSystemDetail.makeModelYear matches summary.makeModelYear', () => {
		
		// MakeModelYear
		const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];

		const updatedSummary = {
			...serviceForm.summary,
			make: 'Chevrolet',
			model: 'Corvette',
			year: 2022,
		}
		
		expect(isVehicleDetailsContingencyFulfilled(ctSystemDetail, updatedSummary)).toBe(true);
	});

	it('Should return true when ctSystemDetail.makeModelYear matches summary.makeModelYear and ctSystemDetail.isRotational matches summary.isRotational', () => {
		
		// MakeModelYear
		const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];

		const updatedCtSystemDetail = {
			...ctSystemDetail,
			isRotational: true,
		}

		const updatedSummary = {
			...serviceForm.summary,
			make: 'Chevrolet',
			model: 'Corvette',
			year: 2022,
		}
		
		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, updatedSummary)).toBe(true);
	})

	it('Should return true when ctSystemDetail.driveType matches summary.driveType', () => {

		const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];

		const updatedCtSystemDetail : CTSystemDetail = {
			...ctSystemDetail,
			makeModelYear: null,
			driveType:[ DriveTypeEnum.FWD],
		}

		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, serviceForm.summary)).toBe(true);
	})

	it('Should return true when summary.isRotational equals CTSystemDetail.isRotational', () => {
		const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];

		const updatedCtSystemDetail: CTSystemDetail = {
			...ctSystemDetail,
			makeModelYear: null,
			isRotational: true,
		}

		const updatedSummary: Partial<Summary> = {
			...serviceForm.summary,
			isRotational: true,
		}

		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, updatedSummary)).toBe(true);
	});

	it('Should return true when summary.mileage is less than CTSystemDetail.mileageMinValue', () => {
				const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];

		const updatedCtSystemDetail: CTSystemDetail = {
			...ctSystemDetail,
			makeModelYear: null,
			mileageMinValue: 201,
		}

		const updatedSummary: Partial<Summary> = {
			...serviceForm.summary,
			mileage: 200	
		}

		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, updatedSummary)).toBe(true);
	})
	
	it('Should return false when summary.mileage is greater than CTSystemDetail.mileageMinValue', () => {
				const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];

		const updatedCtSystemDetail: CTSystemDetail = {
			...ctSystemDetail,
			makeModelYear: null,
			mileageMinValue: 200,
		}

		const updatedSummary: Partial<Summary> = {
			...serviceForm.summary,
			mileage: 201	
		}

		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, updatedSummary)).toBe(false);
	})
	
	it('Should return true when summary.mileage is less than CTSystemDetail.mileageMaxValue', () => {
				const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];

		const updatedCtSystemDetail: CTSystemDetail = {
			...ctSystemDetail,
			makeModelYear: null,
			mileageMaxValue: 201,
		}

		const updatedSummary: Partial<Summary> = {
			...serviceForm.summary,
			mileage: 200	
		}

		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, updatedSummary)).toBe(true);
	})

	it('Should return false when summary.mileage is greater than CTSystemDetail.mileageMaxValue', () => {
		const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];

		const updatedCtSystemDetail: CTSystemDetail = {
			...ctSystemDetail,
			makeModelYear: null,
			mileageMaxValue: 200,
		}

		const updatedSummary: Partial<Summary> = {
			...serviceForm.summary,
			mileage: 201
		}

		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, updatedSummary)).toBe(false);
	});

	it('Should return true when summary.mileage is above CTSystemDetail.mileageMinValue and below CTSystemDetail.mileageMaxValue', () => { 
				const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];

		const updatedCtSystemDetail: CTSystemDetail = {
			...ctSystemDetail,
			makeModelYear: null,
			mileageMinValue: 300,
			mileageMaxValue: 200,
		}

		const updatedSummary: Partial<Summary> = {
			...serviceForm.summary,
			mileage: 150
		}

		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, updatedSummary)).toBe(true);	
	});

	it('Should return false when summary.isRotational does not match CTSystemDetail.isRotational', () => {
		const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];
		
		const updatedCtSystemDetail: CTSystemDetail = {
			...ctSystemDetail,
			makeModelYear: null,
			isRotational: false,
		}

		const updatedSummary: Partial<Summary> = {
			...serviceForm.summary,
			isRotational: true,
		}

		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, updatedSummary)).toBe(false);
	});

	it('Should return true when CTSystemDetail.tireSizes matches summary.frontTireSize or summary.rearTireSize', () => {
		const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];
		
		const updatedCtSystemDetail: CTSystemDetail = {
			...ctSystemDetail,
			makeModelYear: null,
			tireSizes: ["1", "2"],
		}

		const updatedSummary: Partial<Summary> = {
			...serviceForm.summary,
			frontTireSize: "1",
			rearTireSize: "2",
		}

		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, updatedSummary)).toBe(true);
	});

	it('Should return false when CTSystemDetail.tireSizes does not match summary.frontTireSizes or summary.rearTireSizes', () => {
		const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];
		
		const updatedCtSystemDetail: CTSystemDetail = {
			...ctSystemDetail,
			makeModelYear: null,
			tireSizes: ["1", "2"],
		}

		const updatedSummary: Partial<Summary> = {
			...serviceForm.summary,
			frontTireSize: "3",
			rearTireSize: "4",
		}

		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, updatedSummary)).toBe(false);
	});

	it('Should return true when CTSystemDetails.vehiclePowertrain matches summary.vehiclePowertrain', () => {
		const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];
		
		const updatedCtSystemDetail: CTSystemDetail = {
			...ctSystemDetail,
			makeModelYear: null,
			vehiclePowertrain: [VehiclePowertrainEnum.ELECTRIC],
		}

		const updatedSummary: Partial<Summary> = {
			...serviceForm.summary,
			vehiclePowertrain: VehiclePowertrainEnum.ELECTRIC
		}

		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, updatedSummary)).toBe(true);	
	})

	it('Should return true when any CTSystemDetails.vehiclePowertrain value matches summary.vehiclePowertrain', () => {
		const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];
		
		const updatedCtSystemDetail: CTSystemDetail = {
			...ctSystemDetail,
			makeModelYear: null,
			vehiclePowertrain: [VehiclePowertrainEnum.ELECTRIC, VehiclePowertrainEnum.HYBRID],
		}

		const updatedSummary: Partial<Summary> = {
			...serviceForm.summary,
			vehiclePowertrain: VehiclePowertrainEnum.HYBRID
		}

		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, updatedSummary)).toBe(true);	
	})

		it('Should return false when no CTSystemDetails.vehiclePowertrain value matches summary.vehiclePowertrain', () => {
		const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];
		
		const updatedCtSystemDetail: CTSystemDetail = {
			...ctSystemDetail,
			makeModelYear: null,
			vehiclePowertrain: [VehiclePowertrainEnum.INTERNAL_COMBUSTION],
		}

		const updatedSummary: Partial<Summary> = {
			...serviceForm.summary,
			vehiclePowertrain: VehiclePowertrainEnum.HYBRID
		}

		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, updatedSummary)).toBe(false);	
	})

	it('Should return true when CTSystemDetails.vehiclePowertrain matches summary.vehiclePowertrain', () => {
		const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];
		
		const updatedCtSystemDetail: CTSystemDetail = {
			...ctSystemDetail,
			makeModelYear: null,
			vehicleStatuses: [VehicleStatusEnum.ACTIVE],
		}

		const updatedSummary: Partial<Summary> = {
			...serviceForm.summary,
			vehicleStatus: VehicleStatusEnum.ACTIVE
		}

		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, updatedSummary)).toBe(true);	
	})

	it('Should return true when any CTSystemDetails.vehiclePowertrain matches summary.vehiclePowertrain', () => {
		const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];
		
		const updatedCtSystemDetail: CTSystemDetail = {
			...ctSystemDetail,
			makeModelYear: null,
			vehicleStatuses: [VehicleStatusEnum.ACTIVE, VehicleStatusEnum.PENDING],
		}

		const updatedSummary: Partial<Summary> = {
			...serviceForm.summary,
			vehicleStatus: VehicleStatusEnum.PENDING
		}

		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, updatedSummary)).toBe(true);	
	})

	it('Should return false when no CTSystemDetails.vehiclePowertrain matches summary.vehiclePowertrain', () => {
		const [ctSystemDetail] = serviceForm.steps[2].jobs[0].renderedByVehicleDetails ?? [];
		
		const updatedCtSystemDetail: CTSystemDetail = {
			...ctSystemDetail,
			makeModelYear: null,
			vehicleStatuses: [VehicleStatusEnum.ACTIVE, VehicleStatusEnum.PENDING],
		}

		const updatedSummary: Partial<Summary> = {
			...serviceForm.summary,
			vehicleStatus: VehicleStatusEnum.ARCHIVED
		}

		expect(isVehicleDetailsContingencyFulfilled(updatedCtSystemDetail, updatedSummary)).toBe(false);	
	})
})

describe('getShownJobs tests', () => {
	const nonContingentJobs: JDEJob[] = VehicleDetailsContingentJobServiceForm.steps[1].jobs;
	const contingentJobs: JDEJob[] = VehicleDetailsContingentJobServiceForm.steps[2].jobs;
	const doesNotFulfillContingencySummary = VehicleDetailsContingentJobServiceForm.summary;
	const fulfillsContingencySummary = {
		...doesNotFulfillContingencySummary,
		year: 2022,
		make: "Chevrolet",
		model: "Corvette",
	}

	it('Should return all jobs when none are contingent', () => {
		const jobsToTest: JDEJob[] = [...nonContingentJobs, ...nonContingentJobs];
		expect(getShownJobs(jobsToTest, doesNotFulfillContingencySummary)).toEqual(jobsToTest);
	});

	it('Should return all non-contingent jobs and fulfilled jobs', () => {
		expect(getShownJobs(contingentJobs, fulfillsContingencySummary)).toEqual(contingentJobs);
	});

	it('Should return all non-contingent jobs and no unfilfilled contingent jobs', () => {
		expect(getShownJobs([...contingentJobs, ...nonContingentJobs], doesNotFulfillContingencySummary)).toEqual(nonContingentJobs);
	});

	it('Should return all non-contingent jobs and all fulfilled contingent jobs that have multiple fulfilled contingencies', () => {

		const [ctSystemDetail] = contingentJobs[0].renderedByVehicleDetails ?? [];
		
		const updatedCtSystemDetail = {
			...ctSystemDetail,
			isRotational: true,
		} as CTSystemDetail;

		const updatedJob: JDEJob = {
			...contingentJobs[0],
			renderedByVehicleDetails: [updatedCtSystemDetail]
		};

		const multiContingencyJobs = [
			updatedJob,
			...nonContingentJobs,
		]
		
		expect(getShownJobs(multiContingencyJobs, fulfillsContingencySummary)).toEqual(multiContingencyJobs);
	})

	it('Should return all non-contingent jobs and no unfulfilled contingent jobs that have one unfulfilled contingency', () => {

		const [ctSystemDetail] = contingentJobs[0].renderedByVehicleDetails ?? [];
		
		const updatedCtSystemDetail = {
			...ctSystemDetail,
			isRotational: false,
		} as CTSystemDetail;

		const updatedJob: JDEJob = {
			...contingentJobs[0],
			renderedByVehicleDetails: [updatedCtSystemDetail]
		};

		const multiContingencyJobs = [
			updatedJob,
			...nonContingentJobs,
		]
		expect(getShownJobs(multiContingencyJobs, fulfillsContingencySummary)).toEqual(nonContingentJobs);
	})
})

describe("isRenderedByOptionIdsFulfilled tests", () => {
		
		it("Should return true when the answer is included in JobCTQuestion.jobRenderedByOptionIds", () => {
			const [jobCTQuestion]: JobCTQuestion[] = QuestionsContingentJobServiceForm.steps[2].jobs[0]?.renderedByQuestions ?? [];
			
			const correctOptionId = "bfe4cc5b-c304-4453-a7f6-6d54c5b83964";
			
			expect(isRenderedByOptionIdFulfilled(jobCTQuestion, correctOptionId)).toBe(true);
			
		});

		it("Should return false when the answer is not included in JobCTQuestion.jobRenderedByOptionsIds", () => {
			const [jobCTQuestion]: JobCTQuestion[] = QuestionsContingentJobServiceForm.steps[2].jobs[0]?.renderedByQuestions ?? [];
			
			const incorrectOptionId = "d0d92aa1-2781-4d7b-9cd8-136721263781";
			
			expect(isRenderedByOptionIdFulfilled(jobCTQuestion, incorrectOptionId)).toBe(false);
		})
	});
	
describe("isRenderedByQuestionsContingencyFulfilled tests", () => {
	
	const jobCTQuestions : JobCTQuestion[] = QuestionsContingentJobServiceForm.steps[2].jobs[0].renderedByQuestions ?? []; 

	it('Should return true when conditional task action equals "SHOW_ALL" and all questions are answered correctly', () => {
		
		//{ questionId: answerString }
		const ctQuestionAnswers = [
			"bfe4cc5b-c304-4453-a7f6-6d54c5b83964", // optionId == "Yes"
			"83743d93-3b7c-4e15-b617-f18e57c21a84", // optionId == "Yes"
		]
			
		expect(isRenderedByQuestionsContingencyFulfilled(jobCTQuestions, ctQuestionAnswers, ConditionalJobActionEnum.SHOW_ALL)).toEqual(true);
	});

		it('Should return false when conditional task action equals "SHOW_ALL" and not all questions are answered correctly', () => {
		
		//{ questionId: answerString }
		const ctQuestionAnswers = [
			"9e86650a-423e-4a32-ba7c-ecfcd928149c", // optionId == "Yes"
			"54494914-5e29-4887-ab9b-785380e74f33", // optionId == "Yes"
		]
			
		expect(isRenderedByQuestionsContingencyFulfilled(jobCTQuestions, ctQuestionAnswers, ConditionalJobActionEnum.SHOW_ALL)).toEqual(false);
	});

	it('Should return true when conditional task action equals "SHOW_ONE" and at least one question is answered correctly', () => {
		
		//{ questionId: answerString }
		const ctQuestionAnswers = [
			"bfe4cc5b-c304-4453-a7f6-6d54c5b83964", // optionId == "Yes"
			"",
		]
			
		expect(isRenderedByQuestionsContingencyFulfilled(jobCTQuestions, ctQuestionAnswers, ConditionalJobActionEnum.SHOW_ONE)).toEqual(true);
	});

		it('Should return false when conditional task action equals "SHOW_ONE" and all questions are answered incorrectly', () => {
		
		//{ questionId: answerString }
		const ctQuestionAnswers = [
			"",
			"", 
		]
			
		expect(isRenderedByQuestionsContingencyFulfilled(jobCTQuestions, ctQuestionAnswers, ConditionalJobActionEnum.SHOW_ONE)).toEqual(false);
	});
})