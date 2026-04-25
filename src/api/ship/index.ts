import { AutoRouter, cors, error} from "itty-router";
import shipComponents from '../../reference/ship-components.json';

const { preflight, corsify } = cors({
  origin: 'https://oogcapitalmanagement.com',
});

const router = AutoRouter({ 
  base: '/ship',   
  before: [preflight],
  finally: [corsify]
});

router.get('/', () => new Response('Welcome to the OOG Shipwright data APIs!'));

router.get('/component', (req) => {
  return shipComponents;
});

router.get('/component/:ticker', (req) => {
  const component = shipComponents[req.params.ticker as keyof typeof shipComponents];
  if (component) {
    return component;
  } else {
    return error(404, 'Component not found');
  }
});

export default router