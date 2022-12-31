import axios from 'axios';
import datasetClass from '../dataset/index.js';
// sample dataset is:
// {
// 	portfolioByTokenAndDate: {
// 		BTC: {
// 			'2021-12-1': 0.29866 // portfolio of BTC at 2021-12-1
// 		}
// 	},
// 	portfolioByToken: {
// 		BTC: 0.29866 // total portfolio of BTC
// 	}
// };
const getExchangeRate = async (from, to = 'USD') => {
	try {
		const url = `https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`;
		const response = await axios.get(url);
		const {
			data: { [to]: exchangeRate }
		} = response;
		return exchangeRate;
	} catch (error) {
		console.log('getExchangeRate error', error);
	}
};

const calculatePortfolioValue = (transactions, exchangeRate) => {
	let portfolioValue = 0;
	for (const transaction of transactions) {
		const { transaction_type, amount } = transaction;
		portfolioValue +=
			transaction_type === 'DEPOSIT'
				? exchangeRate * amount
				: exchangeRate * -amount;
	}
	return portfolioValue;
};

// return portfolio value per token in USD
const getPortfolioValue = async () => {
	const dataset = datasetClass.getDataSet();
	const dataTexts = [];
	for (const tokenItem in dataset.portfolioByToken) {
		const portfolioValue = dataset.portfolioByToken[tokenItem];
		dataTexts.push(
			`Token "${tokenItem}" with portfolioValue is ${portfolioValue} USD`
		);
	}

	return dataTexts.join('\n');
};

// return the portfolio value for that token in USD
const getPortfolioValueByToken = async token => {
	const dataset = datasetClass.getDataSet();
	const tokenItem = dataset.portfolioByToken[token];
	let totalPortfolio = 0;
	if (tokenItem) {
		totalPortfolio = tokenItem;
	}
	return `Token "${token}" with portfolioValue is ${totalPortfolio} USD`;
};

// Given a date, return the average portfolio value per token in USD on that date by timestamp
const getAveragePortfolioValueByDate = async (date = '2019-9-12') => {
	const dataset = datasetClass.getDataSet();
	date = new Date(date);
	const dateStr = `${date.getFullYear()}-${
		date.getMonth() + 1
	}-${date.getDate()}`;
	const dataTexts = [];
	// foreach key and value in payload object
	for (const [tokenKey, datesValue] of Object.entries(
		dataset.portfolioByTokenAndDate
	)) {
		const portfolioValue = datesValue[dateStr];
		dataTexts.push(
			`At ${dateStr}: token "${tokenKey}" with portfolioValue is ${portfolioValue} USD`
		);
	}
	return dataTexts.join('\n');
};

// Given a date and a token, return the portfolio value of that token in USD on that date
const getPortfolioValueByDateAndToken = async (date = '2022-12-30', token) => {
	const dataset = datasetClass.getDataSet();
	date = new Date(date);
	const dateStr = `${date.getFullYear()}-${
		date.getMonth() + 1
	}-${date.getDate()}`;
	const datesValue = dataset.portfolioByTokenAndDate[token];
	const portfolioValue = datesValue[dateStr];
	return `At ${dateStr}: token "${token}" with portfolioValue is ${portfolioValue} USD`;
};
export default {
	getPortfolioValue,
	getPortfolioValueByToken,
	getAveragePortfolioValueByDate,
	getPortfolioValueByDateAndToken,
	calculatePortfolioValue,
	getExchangeRate
};
