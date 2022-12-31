import { existsSync, readFileSync, createReadStream, writeFileSync } from 'fs';
import { parse } from 'csv-parse';
import func from '../functions/index.js';
import { dir } from 'console';
import path from 'path';

const getUid = () =>
	Math.random().toString(36).substring(2, 15) +
	Math.random().toString(36).substring(2, 15);

class Dataset {
	exchangeRateList = {};
	constructor() {
		// sample dataset is: {
		// 	BTC: {
		// 		'2021-12-1': 0.29866 // portfolio of BTC at 2021-12-1
		// 	}
		// };
		this.dataset = {
			portfolioByTokenAndDate: {},
			portfolioByToken: {}
		};
	}
	getDataSet() {
		return this.dataset;
	}
	async getExchangeRateList() {
		// We will create first via all token in csv file
		this.exchangeRateList = {
			BTC: await func.getExchangeRate('BTC'),
			ETH: await func.getExchangeRate('ETH'),
			XRP: await func.getExchangeRate('XRP')
		};
	}
	checkExistJsonFile(
		filePath = path.join('dataset', 'portfolio-by-token-date.json')
	) {
		if (existsSync(filePath)) {
			return true;
		}
		return false;
	}
	async initDataSet() {
		await this.getExchangeRateList();
		return new Promise(async (resolve, reject) => {
			// check if transactions-json-parse.json exist
			const portfolioByTokenAndDatePath = path.join(
				'dataset',
				'portfolio-by-token-date.json'
			);
			const portfolioByTokenPath = path.join(
				'dataset',
				'portfolio-by-token.json'
			);
			if (this.checkExistJsonFile(portfolioByTokenAndDatePath)) {
				// read file
				let portfolioByTokenAndDate = readFileSync(
					portfolioByTokenAndDatePath,
					'utf8'
				);
				let portfolioByToken = readFileSync(
					portfolioByTokenPath,
					'utf8'
				);
				this.dataset.portfolioByTokenAndDate = JSON.parse(
					portfolioByTokenAndDate
				);
				this.dataset.portfolioByToken = JSON.parse(portfolioByToken);
				resolve(this.dataset);
			} else {
				const { portfolioByTokenAndDate, portfolioByToken } =
					await this.fetchCsvFilePromise('./transactions.csv');
				this.dataset = {
					portfolioByTokenAndDate,
					portfolioByToken
				};
				writeFileSync(
					portfolioByTokenAndDatePath,
					JSON.stringify(portfolioByTokenAndDate)
				);
				writeFileSync(
					portfolioByTokenPath,
					JSON.stringify(portfolioByToken)
				);
				resolve(this.dataset);
			}
		});
	}
	fetchCsvFilePromise = path => {
		return new Promise((resolve, reject) => {
			const portfolioByTokenAndDate = {};
			const portfolioByToken = {};
			let i = 0;
			createReadStream(path)
				.pipe(
					parse({
						delimiter: ',',
						from_line: 2
					})
				)
				.on('data', async row => {
					// row is containing the data of each row:
					//  timestamp: Integer number of seconds since the Epoch, eg: 1610969600
					//  transaction_type: Either a DEPOSIT or a WITHDRAWAL, eg: DEPOSIT
					//  token: The token symbol, eg: BTC
					//  amount: The amount transacted, eg: 0.298660
					// timestamp is auto sort by descending order
					const [timestamp, transaction_type, token, amount] = row;
					// convert timestamp to date and group by date
					const date = new Date(timestamp * 1000);
					const dateStr = `${date.getFullYear()}-${
						date.getMonth() + 1
					}-${date.getDate()}`;
					// portfolioByTokenAndDate
					portfolioByTokenAndDate[token] =
						portfolioByTokenAndDate[token] || {};
					portfolioByTokenAndDate[token][dateStr] =
						portfolioByTokenAndDate[token][dateStr] || 0;
					let portfolio = portfolioByTokenAndDate[token][dateStr];
					portfolio = func.calculatePortfolioValue(
						[{ amount, transaction_type }],
						this.exchangeRateList[token]
					);
					if (transaction_type === 'DEPOSIT')
						portfolioByTokenAndDate[token][dateStr] =
							portfolio + parseFloat(amount);
					else
						portfolioByTokenAndDate[token][dateStr] =
							portfolio - parseFloat(amount);

					// portfolioByToken
					portfolioByToken[token] = portfolioByToken[token] || 0;
					portfolio = portfolioByToken[token];
					portfolio = func.calculatePortfolioValue(
						[{ amount, transaction_type }],
						this.exchangeRateList[token]
					);
					if (transaction_type === 'DEPOSIT')
						portfolioByToken[token] =
							portfolio + parseFloat(amount);
					else
						portfolioByToken[token] =
							portfolio - parseFloat(amount);
					// with 30,000,000 record, print progress of 100% by 1%
					if (i % 300000 === 0) {
						console.log(
							`progress: ${(
								(i / 30000000) *
								100
							).toFixed(2)}%`
						);
					}
					i++;
				})
				.on('end', async () => {
					resolve({ portfolioByTokenAndDate, portfolioByToken });
				})
				.on('error', err => {
					console.log('error', err);
				});
		});
	};
}
const datasetClass = new Dataset();
export default datasetClass;
