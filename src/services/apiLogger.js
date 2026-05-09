// services/ApiLogger.js
export const apiLogger = (store) => (next) => (action) => {
  // Check if the action is from RTK Query
  if (action.type.startsWith("blogApi/")) {
    const currentState = store.getState();

    if (action.type.endsWith("/pending")) {
      console.log(`⏳ API PENDING: ${action.meta.arg.endpointName}`);
    }

    if (action.type.endsWith("/fulfilled")) {
      console.log(`✅ API SUCCESS: ${action.meta.arg.endpointName}`, {
        status: action.payload.status,
        data: action.payload,
      });
    }

    if (action.type.endsWith("/rejected")) {
      console.error(`❌ API ERROR: ${action.meta.arg.endpointName}`, {
        error: action.payload || action.error,
        meta: action.meta,
      });
    }
  }
  return next(action);
};
