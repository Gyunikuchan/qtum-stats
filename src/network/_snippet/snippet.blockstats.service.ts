import * as moment from "moment";
import { Block } from "src/model/Block";
import { BlockStatsService } from "src/network/blockstats.service";

export class SnippetBlockStatsService extends BlockStatsService {
	// =============================================================================
	// Abstract
	// =============================================================================

	protected async getBlocksDayFromSource(date: moment.Moment): Promise<Block[]> {
		return [];
	}
}