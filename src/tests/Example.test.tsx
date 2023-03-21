import * as React from 'react';
import { useState } from 'react';

interface IFetchProps {
	url: string
}

function Fetch (props: IFetchProps) {
	let [showData, setShowData] = useState(false);
	const data = {text: "hello there"};
	
	let renderData = (data: any, show: boolean) => {
		if (show) {
			return <h1>{JSON.stringify(data)}</h1>
		}
		return <h1>no data</h1>
	}
		
	return (
		<>
		<button disabled={showData} onClick={() => {setShowData(true)}}>Load Greeting</button>
		<div>{renderData(data, showData)}</div>
		</>
	);
}
		
// ============================================================================

import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
// import Fetch from './fetch'

test('loads and displays greeting', async () => {
	// ARRANGE
	render(<Fetch url="/greeting" />)
	
	// ACT
	await userEvent.click(screen.getByText('Load Greeting'))
	await screen.findByRole('heading')
	
	// ASSERT
	expect(screen.getByRole('heading')).toHaveTextContent('hello there')
	expect(screen.getByRole('button')).toBeDisabled()
})