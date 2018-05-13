import * as moment from "moment";

import { MDWriter } from "../utils/md-writer";
import { QTUM_BLOCKS_SOURCE_URL, QtumBlockManager } from "./qtum.block.manager";
import { ProducerManager } from "../common/producer.manager";
import { QTUM_ACCOUNTS_SOURCE_URL, QtumAccountManager } from "./qtum.account.manager";

const OUTPUT_PATH = `${__dirname}/../../results/qtum.results.md`;
const writer: MDWriter = new MDWriter();

export async function printStats() {
	writer.open(OUTPUT_PATH);

	writer.writeHeader(`Qtum (${moment().format("MMMM Do YYYY")})`, 1);
	writer.writeLn(`Sources:`);
	writer.writeLn(`${QTUM_BLOCKS_SOURCE_URL}`);
	writer.writeLn(`${QTUM_ACCOUNTS_SOURCE_URL}`);
	writer.writeDivider();
	const producerScore = await writeProducerStats();
	writer.writeDivider();
	const wealthScore = await writeStakeStats();

	writer.close();
}

// =============================================================================
// Producers
// =============================================================================

async function writeProducerStats() {
	writer.writeHeader(`Producer Stats`, 2);

	// Load blocks
	const endLoadMoment = moment();
	const startLoadMoment = moment(endLoadMoment).subtract(1, "week");
	// const startLoadMoment = moment(endLoadMoment).subtract(1, "day");
	const blockManager = new QtumBlockManager();
	await blockManager.load(startLoadMoment, endLoadMoment);

	// 1 day
	const start1Day = moment(endLoadMoment).subtract(1, "day");
	writer.writeHeader(`1 Day Stats`, 3);
	const producersScore1Day = writePeriodProducerStats(blockManager, start1Day, endLoadMoment);
	writer.write();

	// 1 week
	writer.writeHeader(`1 Week Stats`, 3);
	const start1Week = moment(endLoadMoment).subtract(1, "week");
	const producersScore1Week = writePeriodProducerStats(blockManager, start1Week, endLoadMoment);
	writer.write();

	// Producer score
	const producerScore = Math.min(producersScore1Day, producersScore1Week);
	writer.writeLn(`**Number of accounts needed to control 50% blocks: <span style="color:red">${producerScore}**</span>`);

	return producerScore;
}

function writePeriodProducerStats(blockManager: QtumBlockManager, startMoment: moment.Moment, endMoment: moment.Moment) {
	const blocks = blockManager.getBlocks(startMoment, endMoment);
	const producerManager = new ProducerManager(blocks);

	// Number of participating producers
	writer.writeLn(`${producerManager.getProducersCount()} addresses over ${blocks.length} blocks`);

	// Producer score
	const producersScore = producerManager.getNoProducersFor50PercentConsensus();
	writer.writeLn(`50% of the blocks are produced by ${producersScore} of the top addresses`);

	// Top producers
	for (const index of [0, 1, 2, 3, 4, 9, 49, 99]) {
		const producer = producerManager.getProducer(index);
		if (producer)
			writer.writeLnQuoted(`Producer #${index + 1}: mined ${producer.blockCount} blocks`);
	}

	return producersScore;
}

// =============================================================================
// Stake
// =============================================================================

async function writeStakeStats() {
	writer.writeHeader(`Stake Stats`, 2);

	// Load accounts
	const accountManager = new QtumAccountManager();
	await accountManager.load();

	// Top accumulated
	const accumWealthPercent10 = accountManager.getAccumulatedWealthPercentageForAccountsCount(10);
	writer.writeLn(`${accumWealthPercent10.toPrecision(5)}% held by the top 10 accounts`);

	const accumWealthPercent50 = accountManager.getAccumulatedWealthPercentageForAccountsCount(50);
	writer.writeLn(`${accumWealthPercent50.toPrecision(5)}% held by the top 50 accounts`);

	const accumWealthPercent100 = accountManager.getAccumulatedWealthPercentageForAccountsCount(100);
	writer.writeLn(`${accumWealthPercent100.toPrecision(5)}% held by the top 100 accounts`);

	// Top accounts
	for (const index of [0, 1, 2, 3, 4, 9, 49, 99]) {
		const account = accountManager.getAccount(index);
		if (account)
			writer.writeLnQuoted(`Account #${index + 1}: holds ${account.amount}%`);
	}
	writer.write();

	// Stake score
	const stakeScore = accountManager.getNoAccountFor50PercentWealth();
	writer.writeLn(`**Number of accounts needed to control 50% stakes: <span style="color:red">${stakeScore}**</span>`);

	return stakeScore;
}
