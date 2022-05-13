// Global Imports
import styled from 'styled-components';
import { CenterFlexDiv } from '../../LayoutComponents.style';


export const QuestionWrapper = styled(CenterFlexDiv)`
 	background-color: darkgrey;
	width: 100%;
	border: solid thin;
	margin: 5px;
	padding: 5px;
	color: black;
`;

export const QuestionContainer = styled(CenterFlexDiv)`
	width: 100%;
`
export const Label = styled(CenterFlexDiv)`
	font-weight: 800;
	width: 30%;
	justify-content: flex-end;
	text-align: right;
`

export const LabelSeperator = styled.span`
	font-weight: 800;
	font-size: 1.5rem;
	margin: 0 0 0 5px;
`