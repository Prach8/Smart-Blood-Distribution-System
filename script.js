
/* =================================
   ELEMENT REFERENCES
================================= */

const form = document.getElementById("requestForm");

const tableBody =
document.getElementById("requestTable");

const inventoryBody =
document.getElementById("inventoryTable");

/* Dashboard Cards */

const totalRequests =
document.getElementById("totalRequests");

const fulfilledRequests =
document.getElementById("fulfilledRequests");

const availableUnits =
document.getElementById("availableUnits");

const emergencyRequests =
document.getElementById("emergencyRequests");

/* =================================
   UPDATE DASHBOARD
================================= */

function updateDashboard(stats) {

    if (!stats) return;

    if (totalRequests)
        totalRequests.textContent =
        stats.totalRequests || 0;

    if (fulfilledRequests)
        fulfilledRequests.textContent =
        stats.fulfilledRequests || 0;

    if (availableUnits)
        availableUnits.textContent =
        stats.availableUnits || 0;

    if (emergencyRequests)
        emergencyRequests.textContent =
        stats.emergencyRequests || 0;
}

/* =================================
   RENDER TABLES
================================= */

function renderTables(requests, inventory) {

    /* Requests Table */

    tableBody.innerHTML = "";

    requests.forEach(req => {

        let statusClass =
        "status-pending";

        if (
            req.status &&
            req.status.includes("Fulfilled")
        ) {
            statusClass =
            "status-approved";
        }

        if (
            req.status &&
            req.status.includes("Not Fulfilled")
        ) {
            statusClass =
            "status-rejected";
        }

        tableBody.innerHTML += `
        <tr>
            <td>${req.hospital}</td>
            <td>${req.bloodType}</td>
            <td>${req.units}</td>
            <td>${["","High","Medium","Low"][req.urgency]}</td>
            <td>${req.distance} km</td>
            <td>
                <span class="${statusClass}">
                    ${req.status}
                </span>
            </td>
        </tr>
        `;
    });

    /* Inventory Table */

    inventoryBody.innerHTML = "";

    for (let bloodType in inventory) {

        inventoryBody.innerHTML += `
        <tr>
            <td>${bloodType}</td>
            <td>${inventory[bloodType]}</td>
        </tr>
        `;
    }
}

/* =================================
   SUBMIT REQUEST
================================= */

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const request = {

        hospital:
        document.getElementById("hospital").value,

        bloodType:
        document.getElementById("bloodType")
        .value
        .toUpperCase(),

        units:
        parseInt(
            document.getElementById("units").value
        ),

        urgency:
        parseInt(
            document.getElementById("urgency").value
        ),

        distance:
        parseFloat(
            document.getElementById("distance").value
        )
    };

    if (
        !request.hospital ||
        isNaN(request.units) ||
        isNaN(request.urgency) ||
        isNaN(request.distance)
    ) {

        alert(
        "Please fill all fields correctly."
        );

        return;
    }

    fetch("/request", {

        method: "POST",

        headers: {
            "Content-Type":
            "application/json"
        },

        body:
        JSON.stringify(request)

    })

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Server Error"
            );
        }

        return response.json();
    })

    .then(data => {

        console.log(
            "Server Response:",
            data
        );

        renderTables(
            data.requests,
            data.inventory
        );

        updateDashboard(
            data.stats
        );

        form.reset();
    })

    .catch(error => {

        console.error(error);

        alert(
            "Something went wrong. Try again."
        );
    });
});

/* =================================
   REFRESH BUTTON
================================= */

document
.getElementById("refreshBtn")
.addEventListener("click", () => {

    fetch("/reset", {
        method: "POST"
    })

    .then(response =>
        response.json()
    )

    .then(data => {

        renderTables(
            data.requests,
            data.inventory
        );

        updateDashboard(
            data.stats
        );
    })

    .catch(error => {

        console.error(error);
    });
});

/* =================================
   PAGE LOAD
================================= */

window.addEventListener(
"DOMContentLoaded",
() => {

    fetch("/dashboard")

    .then(response =>
        response.json()
    )

    .then(stats => {

        updateDashboard(stats);
    })

    .catch(error => {

        console.error(
            "Dashboard Error:",
            error
        );
    });

});

