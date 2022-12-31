#!/usr/bin/env node

/**
 * hung-transaction
 * Portfolio
 *
 * @author hung <''>
 */

import init from './utils/init.js';
import cli from './utils/cli.js';
import log from './utils/log.js';
import handler from './utils/handler.js';

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	debug && log(flags);
	await handler({ input, flags });
})();
