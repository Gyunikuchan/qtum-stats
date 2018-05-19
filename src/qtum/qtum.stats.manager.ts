import axios from "axios";
import * as cheerio from "cheerio";
import * as moment from "moment";

import { StatsManager } from "../common/stats.manager";
import logger from "../utils/logger";

export const QTUM_BLOCKS_SOURCE_URL = "https://qtum.info/block";
export const QTUM_NODES_SOURCE_URL = "https://qtum.org/api/nodes";
export const QTUM_ACCOUNTS_SOURCE_URL = "https://qtum.info/misc/rich-list";

export class QtumStatsManager extends StatsManager {
	constructor(
		start: moment.Moment,
		end: moment.Moment,
	) {
		super({ start, end, name: "Qtum", percentToTakeOver: 0.5 }, {});
		this.totalWealth = 100;	// In percentage, 0-100
	}

	protected async onLoad() {
		await this.loadAccounts();
		await this.loadBlocks();
		await this.loadTotalNodeCount();
	}

	// =============================================================================
	// Helpers
	// =============================================================================

	protected async loadAccounts() {
		logger.debug(`Loading accounts`);

		const response = await axios.get(QTUM_ACCOUNTS_SOURCE_URL);
		const $ = cheerio.load(response.data);
		const dataRows = $(`#app`).find(`tbody`).children();

		// Loop accounts
		dataRows.each((index, element) => {
			const id = element.children[1].children[0].children[0].children[0].data;
			const percentage = element.children[3].children[0].data;

			this.accounts.push({
				id,
				wealth: Number.parseFloat(percentage),
			});
		});

		logger.debug(`Loaded accounts: ${this.accounts.length}`);
	}

	protected async loadBlocks() {
		logger.debug(`Loading blocks`);

		const dayCounter = moment(this.start).startOf("day");

		// Loop days
		while (dayCounter.isBefore(this.end)) {
			const response = await axios.get(QTUM_BLOCKS_SOURCE_URL, {
				params: {
					date: moment(dayCounter).utc().format("YYYY-MM-DD"),
				},
			});

			const $ = cheerio.load(response.data);
			const dataRows = $(`#app`).find(`tbody`).children();

			// Loop blocks
			dataRows.each((index, element) => {
				// Check time
				const blockTimeString = element.children[1].children[0].data;
				const blockTimeMoment = moment.utc(blockTimeString);

				if (blockTimeMoment.isBefore(this.start))
					return;
				if (blockTimeMoment.isAfter(this.end))
					return;

				// Add block
				const height = Number.parseInt(element.children[0].children[0].children[0].children[0].data);
				const producer = element.children[3].children[0].children[0].children[0].data;
				this.blocks.push({
					height,
					producer,
					time: blockTimeMoment,
				});
			});

			dayCounter.add(1, "day");

			logger.debug(`Loaded blocks for day: ${dayCounter.toString()}, ${this.blocks.length} blocks`);
		}

		// Sort by time
		this.blocks.sort((a, b) => a.time.valueOf() - b.time.valueOf());

		logger.debug(`Loaded blocks: ${this.blocks.length}`);
	}

	protected async loadTotalNodeCount() {
		logger.debug(`Loading total node count`);

		const response = await axios.get(QTUM_NODES_SOURCE_URL);
		const cityStats: any[] = response.data;

		this.totalNodeCount = 0;
		for (const cityStat of cityStats) {
			this.totalNodeCount += cityStat.count;
		}

		logger.debug(`Loaded total node count: ${this.totalNodeCount}`);
	}
}