import { configureStore, combineReducers } from '@reduxjs/toolkit';

import jobDataEntry from './features/jobDataEntry';

const reducer = combineReducers({
	jobDataEntry,
});

const store = configureStore({
	reducer,
})

export default store;