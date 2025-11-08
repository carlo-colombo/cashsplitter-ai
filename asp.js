const db = new Dexie('LedgerDB');

db.version(1).stores({
    events: '++event_id,timestamp,eventType,aggregateId',
    projections: 'projection_key'
});

console.log('LedgerDB initialized');

const App = {
    generateUUID: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    calculateChecksum: function(payload) {
        const data = JSON.stringify(payload);
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash.toString();
    },

    saveEvent: async function(eventType, aggregateId, payload) {
        const timestamp = new Date().toISOString();
        const checksum = this.calculateChecksum(payload);

        const event = {
            timestamp,
            eventType,
            aggregateId,
            payload,
            checksum
        };

        try {
            await db.transaction('rw', db.events, async () => {
                await db.events.add(event);
                console.log('Event saved successfully');
            });
            return true;
        } catch (error) {
            console.error('Failed to save event:', error);
            return false;
        }
    }
};

// Example usage:
db.on('ready', async () => {
    console.log('Database is ready.');
    const testPayload = { group: 'Test Group', amount: 1000 };
    const checksum = App.calculateChecksum(testPayload);
    console.log(`Calculated checksum: ${checksum}`);

    const eventId = App.generateUUID();
    await App.saveEvent('TEST_EVENT', eventId, testPayload);
});
