import welcome from 'cli-welcome';
import pkg from './../package.json' assert { type: 'json' };
import unhandled from 'cli-handle-unhandled';

export default ({ clear = true }) => {
	unhandled();
	welcome({
		title: `hung-transaction`,
		tagLine: `by hung`,
		description: pkg.description,
		version: pkg.version,
		bgColor: '#36BB09',
		color: '#000000',
		bold: true,
		clear
	});
};
