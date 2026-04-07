const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
    "node_modules/@scalar/.+\\.js$": ["ts-jest", { useESM: false }],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@scalar)/)",
  ],
};