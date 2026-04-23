import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import fetchWithCache from '../../src/utils/fetchWithCache';

describe('fetchWithCache', () => {

	beforeAll(async () => {

	});

  it('should return 200 response', async () => {
    const response = await fetchWithCache(new Request("https://rest.fnar.net/material/allmaterials"));
    expect(response.status).toBe(200);
  });

});