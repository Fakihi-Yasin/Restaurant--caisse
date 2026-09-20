// TODO (Step 3): implement full sync logic
// Rules:
//  - Read pending items from db.syncQueue one at a time
//  - POST to the API (idempotent: backend returns existing record if id already exists)
//  - On success: mark item as 'synced'
//  - On failure: increment retries, mark as 'failed' after max retries
//  - Run automatically when navigator.onLine becomes true

export async function processSyncQueue(): Promise<void> {
  // TODO: implement
}

export function startSyncListener(): void {
  // TODO: call processSyncQueue() on window 'online' event
}

export function stopSyncListener(): void {
  // TODO: remove event listener
}
