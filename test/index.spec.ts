/// <reference types="@cloudflare/vitest-pool-workers" />
import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import worker from '../src/index';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Worker', () => {

	beforeAll(async () => {
	});

	afterAll(async () => {
	});

	it('should return 200 response', async () => {
		const request = new IncomingRequest('http://example.com');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(200);
	});

	it('should return the text Hello World!', async () => {
		const request = new IncomingRequest('http://example.com');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toBe('{"code":200,"message":"Ok","data":"Welcome to the OOG Shipwright API!"}');
	});
});
