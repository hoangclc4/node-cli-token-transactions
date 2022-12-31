import meow from 'meow';
import meowHelp from 'cli-meow-help';

const flags = {
	clear: {
		type: `boolean`,
		default: false,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: false,
		desc: `Don't clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	},
	commands: {
		type: `string`,
		alias: `c`,
		desc: `Base on several type of input, the CLI will run different commands \n
		1. Get lastest portfolio value for each token in the dataset \n
		2. Get lastest portfolio value for token "token" in the dataset \n
		3. Get portfolio value per token in USD on date "date" \n
		4. Get portfolio value for token "token in USD on date "date"`
	},
	token: {
		type: `string`,
		alias: `t`,
		desc: `Token name`
	},
	date: {
		type: `string`,
		alias: `d`,
		desc: `Date in format YYYY-MM-DD`
	}
};

const commands = {
	help: { desc: `Print help info` }
};

const helpText = meowHelp({
	name: `hung-transaction`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

export default meow(helpText, options);
