# Security Specification - AI Power Quest

## Data Invariants
- A user can only access and modify their own profile.
- The `userId` field must match the authenticated `request.auth.uid`.
- XP must be a number and cannot be negative.
- `unlockedPowers` must be an array of strings.
- `currentMissionIndex` must be a number.

## The "Dirty Dozen" Payloads

1. **Identity Theft (Create)**: Attempt to create a profile with a different `userId`.
2. **Identity Theft (Update)**: Attempt to update another user's profile.
3. **Ghost Field Injection**: Adding `isAdmin: true` to the user profile.
4. **Invalid XP Type**: Sending `xp: "lots"`.
5. **Negative XP**: Sending `xp: -100`.
6. **Malicious ID Poisoning**: Using a 2KB string as a `userId` in the path.
7. **Mass Update Breach**: Attempting to update multiple fields without following the `affectedKeys` action pattern.
8. **Bypassing Mission Index**: Skipping missions by setting `currentMissionIndex` to 999.
9. **Power Forgery**: Manually adding a power ID that doesn't exist in the data.
10. **Timestamp Spoofer**: Providing a client-side `lastActive` timestamp far in the future.
11. **Unverified User Write**: Attempting to write without being authenticated.
12. **Read Scraper**: Attempting to list all users in the `users` collection.

## Test Runner (firestore.rules.test.ts)

```typescript
// To be implemented if a test framework is available.
// For now, we manually verify the logic in the rules.
```
