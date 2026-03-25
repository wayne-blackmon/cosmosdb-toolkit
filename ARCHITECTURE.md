# Cosmos DB Toolkit Architecture

This document explains the internal architecture of the Cosmos DB Toolkit extension.  
It is designed to be accessible, screen‑reader friendly, and easy to navigate.

## Overview

The extension is metadata‑driven.  
All IntelliSense features come from a single metadata file:
src/providers/metadata/cosmosApi.ts

## Components

### 1. Metadata Schema

Each API group contains:

- label
- functions[]
- signatures[]
- examples
- notes
- snippet (optional)

### 2. Providers

The extension includes:

- Hover Provider
- Completion Provider
- Signature Help Provider

All providers consume the same metadata.

### 3. Metadata Validator

The validator compares metadata to the Cosmos DB SDK .d.ts files.

It detects:

- Missing functions
- Signature mismatches
- Missing metadata groups

### 4. Snippet Routing

The extension supports dual snippet sets:

- JavaScript
- TypeScript

Snippets are defined per metadata entry.

### 5. Folder Structure

src/  
 extension.ts  
 providers/  
 hover/  
 completion/  
 signature/  
 metadata/  
 test/
