// Global Imports
import * as React from 'react';

// Local Imports
import {QuestionWrapper, QuestionContainer, Label, LabelSeperator} from './JDEQuestion.style';
import { InputTypesEnum, JDEQuestion as JDEQuestionType } from '../SharedTypes';
import Input from '../Input/Input'

interface Props {
	question: JDEQuestionType;
}

// eslint-disable-next-line no-empty-pattern
export const JDEQuestion = ({question}: Props) => {

const { label, id, placeholder } = question;

return(
<QuestionWrapper>
		<QuestionContainer>
			<Label>{label}</Label>
			<LabelSeperator>:</LabelSeperator>
			<Input id={id} placeholder={placeholder} />
	</QuestionContainer>
</QuestionWrapper>
)
}