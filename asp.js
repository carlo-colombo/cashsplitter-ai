// vsa-2: Refactor asp.js for client-side event processing and state management.

const db = new Dexie('LedgerDB');

db.version(1).stores({
    events: '++event_id,timestamp,eventType,aggregateId',
    projections: 'projection_key'
});

console.log('LedgerDB initialized');

const App = {
    // --- Modal Control ---
    openModal: function(modalId) {
        document.getElementById(modalId).classList.add('is-active');
    },

    closeModal: function(modalId) {
        document.getElementById(modalId).classList.remove('is-active');
    },

    // --- Core Event Sourcing Functions ---
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
        const event = { timestamp, eventType, aggregateId, payload, checksum };

        try {
            await db.transaction('rw', db.events, async () => {
                await db.events.add(event);
                console.log(`Event '${eventType}' saved successfully`);
            });
            return true;
        } catch (error) {
            console.error(`Failed to save event '${eventType}':`, error);
            return false;
        }
    },

    // --- Application-Specific Logic ---
    processGroupCreation: async function(event) {
        event.preventDefault();
        const form = event.target;
        const groupName = form.elements.groupName.value;
        const groupMembers = form.elements.groupMembers.value.split(',').map(s => s.trim());

        const groupId = this.generateUUID();
        const payload = {
            name: groupName,
            members: groupMembers
        };

        const success = await this.saveEvent('GROUP_CREATED', groupId, payload);

        if (success) {
            await this.recalculateProjections();
            this.closeModal('new-group-modal');
            form.reset();
            htmx.trigger('#group-list', 'update-groups');
        } else {
            // Handle failure, maybe show a notification
            alert('Failed to create group. Check console for details.');
        }
    },

    recalculateProjections: async function() {
        console.log('Recalculating projections...');
        try {
            const allEvents = await db.events.orderBy('timestamp').toArray();
            let groupList = {};

            for (const event of allEvents) {
                if (event.eventType === 'GROUP_CREATED') {
                    groupList[event.aggregateId] = event.payload;
                }
                // Future event types like GROUP_UPDATED, MEMBER_ADDED would be handled here
            }

            await db.projections.put({
                projection_key: 'group_list',
                groups: groupList
            });
            console.log('Projection "group_list" updated successfully.');

        } catch (error) {
            console.error('Failed to recalculate projections:', error);
        }
    },

    init: async function() {
        console.log('App initializing...');
        await this.recalculateProjections();
        console.log('Initial projections calculated.');
    }
};

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
