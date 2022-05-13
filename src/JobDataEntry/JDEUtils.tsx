import { JDEElementIndexPropertiesEnum, JDEJob, Step, JDEElement} from "./SharedTypes";


export const getFlatJDEElement = <T extends { [key: string]: any }, K>(flatParentElement: T[] | null, targetJDEElementType: JDEElementIndexPropertiesEnum) : K[] | [] => {
	if (flatParentElement !== null) {
		return flatParentElement.reduce((targetElementArray: K[] | [], currentTargetElement: T) =>
			[...targetElementArray, ...currentTargetElement[targetJDEElementType] ?? []], []);
	} else {
		return [];
	}
}

/**
 * Returns jobs that have any type of contingency
 * 
 * @param {JDEJob[]}jobs
 * @returns {JDEJob[] | []}
 */
export const getConditionalJobs = (jobs: JDEJob[]): JDEJob[] | [] => {
	const conditionalJobs = jobs.filter((job: JDEJob) =>
		job.renderedByQuestions !== null ||
		job.renderedByVehicleDetails !== null ||
		job.renderedByVehicleDetailsArtificial !== null
	);

	if (conditionalJobs.length) {
		return conditionalJobs
	} else {
		return [];
	}
}