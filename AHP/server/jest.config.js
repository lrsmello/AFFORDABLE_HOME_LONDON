module.exports = {
    // bail: true,
    clearMocks: true,
    setupFilesAfterEnv: ['<rootDir>/__tests__/setupTests.js'],
    testMatch: [
        "**/__tests__/**/*.test.js?(x)"
    ],
    testEnvironment: "node",
    collectCoverage: true,
    coverageDirectory: "__tests__/coverage",
    collectCoverageFrom: ["src/**"]
};