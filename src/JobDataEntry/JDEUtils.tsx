import { JDEElementIndexPropertiesEnum } from "./SharedTypes";

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
export const getConditionalElements = <T extends { [key: string]: any}>(jdeElementArray: T[]) : T[] | [] => {
	//TODO: Add additional conditions and corresponding tests
	const conditionalElements = jdeElementArray.filter((element: T) => element.renderedByQuestions !== null || element.renderedByVehicleDetails !== null || element.renderedByVehicleDetailsArtificial !== null || element.renderedByOptionIds !== null || element.renderedByMin !== null || element.renderedByMax !== null || element.renderedByDriveTypes !== null);
	// const conditionalElements = jdeElementArray.filter((element: T) => element.renderedByQuestions !== null || element.renderedByVehicleDetails !== null);

	return conditionalElements;
} 