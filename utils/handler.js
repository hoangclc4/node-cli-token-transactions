import ora from 'ora';
import chalk from 'chalk';
const { green, yellow } = chalk;
import datasetClass from '../dataset/index.js';
import func from '../functions/index.js';
const spinner = ora({ text: 'Loading...', spinner: 'dots' });
export default async ({ input, flags }) => {
	// Run function
	if (flags.commands) {
		spinner.start(`${green(`Reading file...`)}\n\nIt may take moment…\n`);
		if (!datasetClass.checkExistJsonFile())
			spinner.info(`${yellow(`Json file not exist! Creating...`)}`);
		else spinner.info(`${yellow(`Json file exist! Reading...`)}`);
		await datasetClass.initDataSet();
		// Reading completed! then run function
		spinner.succeed(`${green(`Reading file completed!`)}`);
		let dataText = '';
		switch (flags.commands) {
			case '1':
				spinner.start(
					`${yellow(
						`Getting lastest portfolio value for each token in the dataset...`
					)}`
				);
				dataText = await func.getPortfolioValue();
				spinner.succeed(
					`${green(
						`Getting completed! Portfolio value for each token in the dataset is:  \n🚀\n${dataText}`
					)}`
				);
				break;
			case '2':
				spinner.start(
					`${yellow(
						`Getting lastest portfolio value for token "${flags.token}" in the dataset...`
					)}`
				);

				dataText = await func.getPortfolioValueByToken(flags.token);
				spinner.succeed(
					`${green(
						`Getting completed! Portfolio value for token "${flags.token}" in the dataset is:  \n🚀\n${dataText}`
					)}`
				);
				break;
			case '3':
				spinner.start(
					`${yellow(
						`Getting portfolio value per token in USD on date "${flags.date}"...`
					)}`
				);
				dataText = await func.getAveragePortfolioValueByDate(
					flags.date
				);
				spinner.succeed(
					`${green(
						`Getting completed! Portfolio value per token in USD on date "${flags.date} is:  \n🚀\n${dataText}`
					)}`
				);
				break;
			case '4':
				spinner.start(
					`${yellow(
						`Getting portfolio value for token "${flags.token}" in USD on date "${flags.date}"...`
					)}`
				);
				dataText = await func.getPortfolioValueByDateAndToken(
					flags.date,
					flags.token
				);
				spinner.succeed(
					`${green(
						`Getting completed! Portfolio value for token "${flags.token}" in USD on date "${flags.date}" is:  \n🚀\n${dataText}`
					)}`
				);
				break;
		}
	}
};
