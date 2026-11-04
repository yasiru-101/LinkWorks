# Job and quote contract for implementation

**Owner:** Thimanya. Chanuli reviews the trusted operation and rules; Bhashitha reviews the user flow.

1. A client creates a job in `open` with integer LKR budget fields, category, title, description, and an explicit location containing coordinates and geohash. `applicationCount` starts at zero.
2. A worker with a worker profile may create one `jobs/{jobId}/applications/{workerId}` document while the job is open. It contains a positive whole-LKR quote, a pitch, and status `submitted`. The worker cannot set accepted/rejected status.
3. A callable trusted operation accepts a quote. It verifies the authenticated caller owns the open job, the submitted quote exists, and no worker is already assigned. Within one transaction it sets `status = assigned`, `assignedWorkerId`, and `acceptedPriceLkr` on the job; marks the chosen application `accepted`; and rejects the other submitted applications. It is safe to retry and cannot accept a second worker.
4. The assigned worker may start the job, then request completion. The client confirms the final `completed` state. The completion request needs a separate timestamp or request record; it is not a new persisted job status. Open jobs may be cancelled by the client before assignment.
5. `applicationCount`, accepted price, assignment, and status changes beyond open-job edits are trusted fields. Firestore rules deny direct app writes to them. Participants can read the final state after an app restart.

Phase 1 implements the schema, validation helpers, and deny-by-default rules. Phase 3 implements the trusted transaction and its race tests.
