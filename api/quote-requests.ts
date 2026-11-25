import quoteRoutes from "../worker/firebase-quotes";

export default {
  fetch(request: Request) {
    return quoteRoutes.fetch(request, { FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON });
  },
};
