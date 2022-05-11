import React from 'react'

import { JDEHeaderWrapper, ServiceInfo, ServiceInfoItem } from './JDEHeader.style';

import { selectHeaderContent } from '../../redux/features/jobDataEntry';

import { useSelector } from 'react-redux';

type Props = {}

const JDEHeader = (props: Props) : React.ReactElement => {
	
	const headerContent = useSelector((state) => selectHeaderContent(state));

	return (
		<JDEHeaderWrapper>
			<div>
				<h1>JDEHeader</h1>
				<ServiceInfo>
						<ServiceInfoItem>Company: {headerContent.companyName}</ServiceInfoItem>
						<ServiceInfoItem>VIN: {headerContent.vin}</ServiceInfoItem>
				</ServiceInfo>
			</div>
		</JDEHeaderWrapper>
	)
}

export default JDEHeader;