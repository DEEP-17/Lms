const requiredEnvVars = [
  "ACCESS_TOKEN",
  "REFRESH_TOKEN",
  "ACCESS_TOKEN_EXPIRE",
  "REFRESH_TOKEN_EXPIRE",
  "ACTIVATION_SECRET",
  // add any other required env vars here
];

export function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}
