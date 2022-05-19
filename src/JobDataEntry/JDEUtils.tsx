import { isEqual } from 'lodash';
import { CTSystemDetail, DriveType, JDEElementIndexPropertiesEnum, JDEJob, MakeModelYear, Summary, VehiclePowertrain, VehicleStatus } from "./SharedTypes";

/**
 * Accepts a flat JDEElement array and returns a flat array of their JDEElement child
 * 
 * For example, `steps` will return a flat array of `JDEJob` elements
 * 
 * @param {<T>[] | null} flatParentElement 
 * @param {JDEElementIndexPropertiesEnum} targetJDEElementType 
 * @returns {<K>[] | []} 
 */
export const getFlatJDEElement = <T extends { [key: string]: any }, K>(flatParentElement: T[] | null, targetJDEElementType: JDEElementIndexPropertiesEnum) : K[] | [] => {
	if (flatParentElement !== null) {
		return flatParentElement.reduce((targetElementArray: K[] | [], currentTargetElement: T) =>
			[...targetElementArray, ...currentTargetElement[targetJDEElementType] ?? []], []);
	} else {
		return [];
	}
}

/**
 * Returns any contingent elements for a given set of JDEElement objects
 * 
 * @param {<T>[]} jdeElementArray 
 * @returns {T[] | []}
 */
export const getConditionalElements = <T extends { [key: string]: any }>(jdeElementArray: T[]): T[] | [] => {
	const conditionalElements = jdeElementArray.filter((element: T) => element.renderedByQuestions && element.renderedByQuestions !== null || element.renderedByVehicleDetails && element.renderedByVehicleDetails !== null || element.renderedByVehicleDetailsArtificial && element.renderedByVehicleDetailsArtificial !== null || element.renderedByOptionIds && element.renderedByOptionIds !== null || element.renderedByMin && element.renderedByMin !== null || element.renderedByMax && element.renderedByMax !== null || element.renderedByDriveTypes && element.renderedByDriveTypes !== null);
	
	return conditionalElements;
};

/**
 * Checks if any makeModelYear object is a match for the summary makeModelYear
 * 
 * @param {MakeModelYear[]} makeModelYearConditions 
 * @param {MakeModelYear}summaryMakeModelYear 
 * @returns {boolean}
 */
export const areMakeModelYearsMatched = (makeModelYearConditions: MakeModelYear[], summaryMakeModelYear: MakeModelYear) => {
	return makeModelYearConditions.some((makeModelYearCondition: MakeModelYear) => isEqual(makeModelYearCondition,summaryMakeModelYear));
}

/**
 * Checks that a value is above or below mileageMinValue or mileageMaxValue
 * 
 * @param {"mileageMinValue" | "mileageMaxValue"}conditionalKey 
 * @param { number }conditionalValue 
 * @param { number | null | undefined} summaryValue 
 * @returns { boolean }
 */
export const isMileageValueMatched = (conditionalKey: "mileageMinValue" | "mileageMaxValue", conditionalValue: number, summaryValue: number | null | undefined = 0): boolean => {
	switch (conditionalKey) {
		/** This is the maximum value that summary can be and still be true */
		case 'mileageMaxValue':
			return conditionalValue >= (summaryValue ?? 0);
		/** This is the minimum value that summary can be and still be true */
		case 'mileageMinValue':
			return (summaryValue ?? 0) <= conditionalValue;
		default:
			return true;
	}
}

/**
 *	Checks if any tire sizes match betwen a list of tire size conditions 
 *	and the known front and rear tires sizes for a vehicle 
 *
 * @param {string[]}condtitionalTireSizes 
 * @param {[string, string]}summaryTireSizes 
 * @returns {boolean}
 */
export const doTireSizesMatch = (condtitionalTireSizes: string[], summaryTireSizes: [string, string]): boolean => {
	return summaryTireSizes.some((tireSize: string) => condtitionalTireSizes.some((condtitionalTireSize: string) => condtitionalTireSize === tireSize))
}

export const isVehicleDetailsContingencyFulfilled = (ctSystemDetail : CTSystemDetail, summary : Partial<Summary>): boolean => {	
	const conditionalProperties = Object.entries(ctSystemDetail).filter(([conditionalKey, value]) => value !== null && conditionalKey !== 'id');
	const checkConditionalProperties = (conditionalKey: string, conditionalValue: any) => {
		switch (conditionalKey) {
			case "companyId":
				return  (conditionalValue[0] ?? "")  === summary.companyId;
			case "makeModelYear":
				return areMakeModelYearsMatched(conditionalValue, { make: summary.make ?? '', model: summary.model ?? '', year: summary.year ?? 0})
			case "driveType":
				return conditionalValue.some((driveTypeValue: DriveType) => driveTypeValue === summary.driveType)
			// The summary milage value must be more than the conditional value
			case "mileageMinValue":
				return isMileageValueMatched(conditionalKey, conditionalValue, summary.mileage);
			case "mileageMaxValue":
				return isMileageValueMatched(conditionalKey, conditionalValue, summary.mileage);
			case "isRotational":
				return (summary.isRotational ?? false) === conditionalValue
			case "tireSizes":
				return doTireSizesMatch(conditionalValue, [summary.frontTireSize ?? "", summary.rearTireSize ?? ""]);
			case "vehiclePowertrain":
				return conditionalValue.some((powertrainValue: VehiclePowertrain) => powertrainValue === summary.vehiclePowertrain);
			case "vehicleStatuses":
				return conditionalValue.some((vehicleStatus: VehicleStatus) => vehicleStatus === summary.vehicleStatus);
			default:
				return true;
		}
	}

return conditionalProperties.map(([conditionalKey, conditionalValue]: [string, any]) => checkConditionalProperties(conditionalKey, conditionalValue)).every((conditionalBoolean: boolean) => conditionalBoolean === true);
}

export const getShownJobs = (jobs: JDEJob[], summary: Partial<Summary>): JDEJob[] | [] => { 
	
	const shownJobs = jobs.reduce<JDEJob[]>((accumulatedJobs, currentJob) => {
		if (currentJob.renderedByQuestions === null && currentJob.renderedByVehicleDetails === null && currentJob.renderedByVehicleDetailsArtificial === null) {
			return [...accumulatedJobs, currentJob]
		} else if(currentJob.renderedByVehicleDetails){
			const isContingencyFulfilled : boolean = currentJob.renderedByVehicleDetails.map((ctSystemDetail: CTSystemDetail) => isVehicleDetailsContingencyFulfilled(ctSystemDetail, summary)).every((contingencyFulfilledStatus: boolean) => contingencyFulfilledStatus === true);
			
			if (isContingencyFulfilled) {
				return [...accumulatedJobs, currentJob]
			} else {
				return accumulatedJobs
			}
			
		} else {
			return accumulatedJobs;
		}
	}, [])
	return shownJobs;
};