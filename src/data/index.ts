import { AutoRouter, cors} from "itty-router";
import { APIResponse } from "../utils/APIResponse";

const { preflight, corsify } = cors({
  origin: 'https://oogcapitalmanagement.com',
});

const router = AutoRouter({ 
  base: '/data',   
  before: [preflight],
  finally: [corsify]
});

router.get('/', () => new Response('Welcome to the OOG Shipwright data APIs!'));

import shipComponents from '../constants/ship-components.json';
router.get('/ship/component', (req) => {
  return APIResponse.ok(shipComponents);
});
router.get('/ship/component/:code', (req) => {
  const component = shipComponents[req.params.code as keyof typeof shipComponents];
  if (component) {
    return APIResponse.ok(component);
  } else {
    return APIResponse.notfound('Component not found');
  }
});

export default router