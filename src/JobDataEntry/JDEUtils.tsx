import { CTSystemDetail, JDEElementIndexPropertiesEnum, MakeModelYear, Summary } from "./SharedTypes";

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
	console.log(makeModelYearConditions[0], summaryMakeModelYear)
	return makeModelYearConditions.some((makeModelYearCondition: MakeModelYear) => makeModelYearCondition === summaryMakeModelYear);
}

export const isVehicleDetailsContingencyFulfilled = (ctSystemDetail : CTSystemDetail, summary : Partial<Summary>): boolean => {	
	//@ts-ignore	
	const [conditionalProperty, conditionalValue] = Object.entries(ctSystemDetail).find(([conditionalKey, value]) => value !== null && conditionalKey !== 'id');

	switch (conditionalProperty) {
		case "id":
			return true;
		case "makeModelYear":
			return areMakeModelYearsMatched(conditionalValue, { make: summary.make ?? '', model: summary.model ?? '', year: summary.year ?? 0})		
		default:
			break;
	}
	
	
	return true;
}