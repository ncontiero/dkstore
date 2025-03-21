require("dotenv").config();

const defaultOpts = {
  script: "./index.js",
  env_production: {
    NODE_ENV: "production",
  },
  env_development: {
    NODE_ENV: "development",
  },
};

module.exports = {
  apps: [
    {
      name: "worker",
      cwd: "./apps/worker/dist",
      instances: process.env.WORKER_INSTANCES || 1,
      ...defaultOpts,
    },
    {
      name: "queue-dashboard",
      cwd: "./apps/queue-dashboard/dist",
      instances: process.env.DASHBOARD_INSTANCES || 1,
      port: process.env.PORT || 3002,
      ...defaultOpts,
    },
  ],
};
