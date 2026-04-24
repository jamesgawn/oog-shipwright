import { AutoRouter } from "itty-router";
import { APIResponse } from "../utils/APIResponse";

const router = AutoRouter({ base: '/data' });

router.get('/', () => new Response('Welcome to the OOG Shipwright data APIs!'));

import shipComponents from '../constants/ship-components.json';
router.get('/ship/components', (req) => {
  return APIResponse.ok(shipComponents);
});
router.get('/ship/components/:code', (req) => {
  const component = shipComponents[req.params.code as keyof typeof shipComponents];
  if (component) {
    return APIResponse.ok(component);
  } else {
    return APIResponse.notfound('Component not found');
  }
});

export default router