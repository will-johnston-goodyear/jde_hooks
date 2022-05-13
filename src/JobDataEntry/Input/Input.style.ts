// Global Imports
import styled from 'styled-components';

export const InputWrapper = styled.div`
 	display: flex;
	flex-grow: 1;
	margin: 0 0 0 10px;
`;

export const StyledInput = styled.input<{
	placeholder: string,
}>`
	flex-grow: 1;
`