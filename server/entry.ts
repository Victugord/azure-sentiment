import { eventHandler, getWebRequest } from "vinxi/http";
import { app } from ".";

export default eventHandler(async (event) => {
  const req = getWebRequest(event);

  return app.fetch(req);
});
