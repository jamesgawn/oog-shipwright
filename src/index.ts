import { AutoRouter } from 'itty-router';
import { APIInteraction, APIPingInteraction } from 'discord-api-types/v10';
import { deploy, withVerify } from './discord/utils';
import { InteractionHandler } from './discord/handlers/InteractionHandler';
import { logger, beforeHandler, finallyHandler } from './utils/logger';
import material from './api/material'
import ship from './api/ship'
import fio from './api/fio'

const router = AutoRouter({
	before: [beforeHandler],
	finally: [finallyHandler]
});

router.post('/discord/interactions', withVerify, async (request, env) => {
	
	const interaction = await request.json<APIInteraction | APIPingInteraction>();
	logger.info(interaction, "Processing interaction request")
	const interactionHandler = new InteractionHandler(env);
	const interactionResponse = await interactionHandler.handle(interaction);
	logger.info(interactionResponse.response, "Sending interaction response");
	return interactionResponse;

});

router.all("/material/*", material.fetch)
router.all("/fio/*", fio.fetch)
router.all("/ship/*", ship.fetch);

router.get('/discord/admin/register', async (request, env) => {
	return deploy(env);
});

router.get('/', () => {
	return 'Welcome to the OOG Shipwright API!';
});

export default router
