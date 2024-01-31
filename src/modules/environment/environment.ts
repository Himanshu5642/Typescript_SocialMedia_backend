import * as environment from "./environment.json";
const env: string = process.env.NODE_ENV || "development";

type envType = {
  [Key: string]: string;
};

if (env == "development") {
  let envConfig: envType = environment[env];
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
} else {
  let envConfig: envType = environment.production;
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
