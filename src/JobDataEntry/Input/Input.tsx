import React from 'react'
import { InputTypes, InputTypesEnum } from '../SharedTypes';
import { useFormContext } from 'react-hook-form';

import { InputWrapper, StyledInput } from './Input.style';

type Props = {
	id: string,
	placeholder: string | null,
}

const Input = ({ id, placeholder }: Props) => {

	const { register, getValues } = useFormContext();

	const inputValue = getValues(id);

	return (
		//@ts-ignore
		<StyledInput type="text" {...register(id)} />
	)
}

export default Input;