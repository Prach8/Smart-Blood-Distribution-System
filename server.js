const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(__dirname));

/* ===========================
   BLOOD INVENTORY
=========================== */

let inventory = {
    'A+': 100,
    'A-': 50,
    'B+': 80,
    'B-': 40,
    'O+': 120,
    'O-': 60,
    'AB+': 30,
    'AB-': 20
};

/* ===========================
   COMPATIBILITY TABLE
=========================== */

const compatible = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-']
};

let requests = [];

/* ===========================
   RESET INVENTORY
=========================== */

function resetInventory() {

    inventory = {
        'A+': 100,
        'A-': 50,
        'B+': 80,
        'B-': 40,
        'O+': 120,
        'O-': 60,
        'AB+': 30,
        'AB-': 20
    };

}

/* ===========================
   LOW STOCK DETECTION
=========================== */

function getLowStockBloodTypes() {

    const lowStock = [];

    for (let bloodType in inventory) {

        if (inventory[bloodType] < 20) {

            lowStock.push({
                bloodType,
                units: inventory[bloodType]
            });

        }

    }

    return lowStock;
}

/* ===========================
   BLOOD ASSIGNMENT
=========================== */

function assignBlood(req, inventory, label) {

    const donors = compatible[req.bloodType] || [];

    req.status = 'Not Fulfilled';

    for (let donor of donors) {

        if (inventory[donor] >= req.units) {

            inventory[donor] -= req.units;

            req.status = `Fulfilled (${label})`;

            return;
        }
    }
}

/* ===========================
   ALGORITHM SELECTION
=========================== */

function applyAlgorithm(reqs) {

    const avgUrg =
        reqs.reduce((sum, r) => sum + r.urgency, 0) /
        reqs.length;

    const allSameUrg =
        reqs.every(r => r.urgency === reqs[0].urgency);

    const allLowUrg =
        reqs.every(r => r.urgency === 3);

    const allMedUrg =
        reqs.every(r => r.urgency === 2);

    const sameUnits =
        reqs.every(r => r.units === reqs[0].units);

    const closeDistance =
        reqs.every(r => r.distance <= 5);

    if (avgUrg <= 1.5) return 'Priority Scheduling';

    if (allLowUrg) return 'LRTF';

    if (allMedUrg && sameUnits) return 'Round Robin';

    if (!allSameUrg && closeDistance)
        return 'Producer Consumer';

    if (allSameUrg) return 'SRTF';

    return 'FIFO';
}

/* ===========================
   RUN ALGORITHM
=========================== */

function runAlgorithm(algo, reqs) {

    resetInventory();

    switch (algo) {

        case 'Priority Scheduling':

            reqs.sort((a, b) => a.urgency - b.urgency);

            reqs.forEach(r =>
                assignBlood(r, inventory, 'Priority')
            );

            break;

        case 'SRTF':

            reqs.sort((a, b) => a.distance - b.distance);

            reqs.forEach(r =>
                assignBlood(r, inventory, 'SRTF')
            );

            break;

        case 'LRTF':

            reqs.sort((a, b) => b.units - a.units);

            reqs.forEach(r =>
                assignBlood(r, inventory, 'LRTF')
            );

            break;

        case 'Round Robin':

            let quantum = 2;

            let queue = reqs.map(r => ({
                ...r,
                remainingUnits: r.units
            }));

            while (queue.length) {

                let req = queue.shift();

                const donors =
                    compatible[req.bloodType] || [];

                for (let donor of donors) {

                    if (inventory[donor] > 0) {

                        let used = Math.min(
                            quantum,
                            req.remainingUnits,
                            inventory[donor]
                        );

                        inventory[donor] -= used;

                        req.remainingUnits -= used;

                        req.status =
                            req.remainingUnits <= 0
                                ? 'Fulfilled (RR)'
                                : 'Partially Fulfilled (RR)';

                        if (req.remainingUnits > 0)
                            queue.push(req);

                        break;
                    }
                }
            }

            break;

        case 'Producer Consumer':

            let buffer = [];

            const maxBuffer = 5;

            reqs.forEach(r => {

                if (buffer.length < maxBuffer)
                    buffer.push(r);

                else
                    r.status = 'Skipped (Buffer Full)';
            });

            buffer.forEach(r =>
                assignBlood(r, inventory, 'PC')
            );

            break;

        default:

            reqs.forEach(r =>
                assignBlood(r, inventory, 'FIFO')
            );
    }
}

/* ===========================
   DASHBOARD STATS
=========================== */

function getStats() {

    return {

        totalRequests: requests.length,

        emergencyRequests:
            requests.filter(r => r.urgency === 1).length,

        mediumPriorityRequests:
            requests.filter(r => r.urgency === 2).length,

        lowPriorityRequests:
            requests.filter(r => r.urgency === 3).length,

        fulfilledRequests:
            requests.filter(r =>
                r.status.includes('Fulfilled')
            ).length,

        unfulfilledRequests:
            requests.filter(r =>
                r.status.includes('Not Fulfilled')
            ).length,

        availableUnits:
            Object.values(inventory)
                .reduce((sum, val) => sum + val, 0),

        lowStock:
            getLowStockBloodTypes()
    };
}

/* ===========================
   REQUEST ENDPOINT
=========================== */

app.post('/request', (req, res) => {

    const newRequest = {
        ...req.body,
        status: 'Pending',
        timestamp: new Date()
    };

    requests.push(newRequest);

    const algorithm =
        applyAlgorithm(requests);

    runAlgorithm(
        algorithm,
        requests
    );

    res.json({
        requests,
        inventory,
        algorithm,
        stats: getStats()
    });
});

/* ===========================
   RESET ENDPOINT
=========================== */

app.post('/reset', (req, res) => {

    requests = [];

    resetInventory();

    res.json({
        requests,
        inventory,
        stats: getStats()
    });
});

/* ===========================
   DASHBOARD ENDPOINT
=========================== */

app.get('/dashboard', (req, res) => {

    res.json(getStats());

});

/* ===========================
   START SERVER
=========================== */

const PORT = 3000;

app.listen(PORT, () => {

    console.log( 
        `✅ Server running at http://localhost:${PORT}`
    );

});

