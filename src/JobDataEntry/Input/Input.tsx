import React from 'react'
import { InputTypes, InputTypesEnum } from '../SharedTypes';
import { useFormContext } from 'react-hook-form';

import { InputWrapper, StyledInput } from './Input.style';

type Props = {
	id: string,
	placeholder: string | null,
}

const Input = ({ id, placeholder }: Props) => {

	const { register, getValues, setValue } = useFormContext();

	const inputValue = getValues(id);

	const inputs = {
		//@ts-ignore
		[InputTypesEnum.TEXT]: <StyledInput type="text" {...register(id)} value={inputValue} placeholder={placeholder} onChange={(event : React.FormEvent<HTMLInputElement>) => setValue(id, event.target.value)}/>,
	}
	return (
		<InputWrapper>{inputs[InputTypesEnum.TEXT ]}</InputWrapper>
	)
}

export default Input