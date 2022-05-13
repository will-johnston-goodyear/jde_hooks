import { JDEJob, Step } from "./SharedTypes";


/**
 * Function that returns an array of JDEJobs from a given array of Steps
 * 
 * @param {Step[]} steps 
 * @returns {JDEJob[]}
 */
export const getJobs = ( steps : Step[]) : JDEJob[] | void => {
	console.log(steps);
}