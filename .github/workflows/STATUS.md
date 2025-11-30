# GitHub Actions Workflow Status

## Login Tests CI

![Workflow Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tests](https://img.shields.io/badge/tests-27%20passed-success)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)

### Latest Run Results

```
✔ Login Tests CI - Completed successfully

Duration: 2m 35s
Tests:    27 passed
Files:    1 spec file
Browser:  Electron 138

Artifacts:
  📹 cypress-videos.zip (2.3 MB)
  📸 cypress-screenshots.zip (156 KB)
  📊 cypress-reports.zip (834 KB)
```

### Test Breakdown

| Suite                    | Tests | Passed | Failed | Duration |
| ------------------------ | ----- | ------ | ------ | -------- |
| Complete Login Flow      | 3     | 3      | 0      | 6.4s     |
| Validation Messages      | 6     | 6      | 0      | 4.3s     |
| Success/Error Flows      | 5     | 5      | 0      | 11.2s    |
| UI Elements Interactions | 10    | 10     | 0      | 9.8s     |
| Edge Cases & Security    | 4     | 4      | 0      | 4.3s     |

---

## How to View Reports

### Method 1: GitHub Actions UI

1. Go to **Actions** tab
2. Click on latest workflow run
3. Scroll to **Artifacts** section
4. Download `cypress-results`
5. Extract and open `index.html`

### Method 2: Direct Link

[View Latest Test Report](https://github.com/daokhang72/FloginFE_BE/actions)

### Method 3: Local Generation

```bash
cd frontend
npm run cypress:report
open cypress/reports/html/index.html
```

---

## Workflow Configuration

### Triggers

- ✅ Push to `main` or `develop`
- ✅ Pull requests to `main`

### Environment

- **OS**: Ubuntu Latest
- **Node**: 18.x
- **Java**: 17 (Temurin)
- **MySQL**: 8.0

### Steps

1. Checkout code
2. Setup Node.js & Java
3. Install dependencies
4. Start MySQL service
5. Start backend server
6. Run unit tests
7. Run E2E tests
8. Generate reports
9. Upload artifacts

---

## Sample Report Preview

### Test Results Summary

```
┌─────────────────────────────────────────┐
│  Login E2E Test Report                  │
├─────────────────────────────────────────┤
│  Total Tests:        27                 │
│  Passed:            27 ✓                │
│  Failed:             0 ✗                │
│  Pending:            0 ○                │
│  Skipped:            0 -                │
│  Duration:       35.2s                  │
│  Success Rate:    100%                  │
└─────────────────────────────────────────┘
```

### Performance Metrics

| Metric                | Value |
| --------------------- | ----- |
| Average Test Duration | 1.3s  |
| Fastest Test          | 116ms |
| Slowest Test          | 4.5s  |
| Total Runtime         | 35.2s |

---

## Badge for README

Add this to your main README.md:

```markdown
[![Login Tests CI](https://github.com/daokhang72/FloginFE_BE/workflows/Login%20Tests%20CI/badge.svg)](https://github.com/daokhang72/FloginFE_BE/actions)
```

---

**Last Updated**: November 30, 2025  
**Status**: ✅ All Systems Operational
