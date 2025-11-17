
import app from './index.js';
import { getPort } from './config.js';


(function main() {
  const port = getPort();
  app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
})();
