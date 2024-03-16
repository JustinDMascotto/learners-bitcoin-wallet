module.exports = {
    preset: 'ts-jest',
    // testEnvironment: 'node',
    // For a React project, you might want to use 'jsdom' instead of 'node'
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: ['/node_modules/'],
  };