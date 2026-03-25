# Testing Guide

This document explains how to run tests and interpret validator output.

## Running Tests

Run all tests:
npm test

The test suite uses:

- Mocha
- VS Code test harness

## Test Types

- Provider tests
- Metadata validator tests
- Activation tests

## Metadata Validator Output

If metadata drifts from the Cosmos SDK, you may see messages like:

\"Missing metadata group for IContext\"  
\"Suggestion: Add function 'queryDocuments' to collection.functions with signature (...)\"

Follow the suggestions to update metadata.

## Debugging Tests

1. Open the test file.
2. Set breakpoints.
3. Run the \"Extension Tests\" launch configuration.
