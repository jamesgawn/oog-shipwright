import { AutoRouter } from "itty-router";
import { logger } from "../../utils/logger";
import { FioStorageHandler } from "./handlers/FioStorageHandler";
import { FioContext, FioAPI } from "./utils/FioApi";

const router = AutoRouter({ base: '/fio' });

router.get('/', () => new Response('Welcome to the Prosperous Universe FIO helper APIs!'));

router.get('/*', FioAPI.withFioApi);

router.get('/storage/:username', async ({username}, context: FioContext) => {
	logger.info("Processing FIO storage request")
	const fioStoragehander = new FioStorageHandler(context);
	const fioStorageResponse = await fioStoragehander.handler(username)
	logger.info("Completed FIO storage request")
	
	// Set TTL header to 2 minutes (120 seconds)
	const response = new Response(JSON.stringify(fioStorageResponse), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=120'
		}
	});
	
	return response;
});

export default router