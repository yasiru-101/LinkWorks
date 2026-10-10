const { initializeApp } = require('firebase-admin/app');

// Prepare one Admin app for the trusted assignment and counter Functions in later phases.
initializeApp();

// Phase 1 intentionally exports no callable operation before its transaction tests exist.
