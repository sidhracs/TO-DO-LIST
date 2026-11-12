/* ==========================================
   1. PERSONAL DETAILS
========================================== */

// CHANGE THESE TWO VALUES
const MY_NAME = "SIDHRA C S";
const MY_STUDY = "AI AND ML STUDENT";

// Display personal details on home page
document.getElementById("welcomeName").textContent = MY_NAME;

document.getElementById("welcomeStudy").textContent =
     MY_STUDY;

document.getElementById("studyCard").textContent = MY_STUDY;

document.getElementById("personName").value = MY_NAME;




/* ==========================================
   2. NAVIGATION
========================================== */

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {

        page.classList.toggle(
            "active",
            page.id === pageId
        );

    });

    document.querySelectorAll(".nav-link").forEach(link => {

        link.classList.toggle(
            "active",
            link.dataset.page === pageId
        );

    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// Home and To Do List navigation
document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        showPage(link.dataset.page);

    });

});


// Get started button
document.getElementById("startButton").addEventListener("click", () => {

    showPage("todoPage");

});


/* ==========================================
   3. CREATE TASK ROWS
========================================== */

// Number of rows in each section
const sections = [

    { id: "tasks", count: 18 },

    { id: "priorities", count: 6 },

    { id: "reminders", count: 6 }

];


// Create editable rows
sections.forEach(section => {

    const container = document.getElementById(section.id);

    for (let i = 0; i < section.count; i++) {

        const row = document.createElement("div");

        row.className = "task-row";


        // Create checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.setAttribute(
            "aria-label",
            `Mark ${section.id} item ${i + 1} complete`
        );


        // Create text input
        const text = document.createElement("input");

        text.type = "text";

        text.setAttribute(
            "aria-label",
            `${section.id} item ${i + 1}`
        );


        // Checkbox event
        checkbox.addEventListener("change", () => {

            row.classList.toggle("done", checkbox.checked);

            saveList();

        });


        // Save when typing
        text.addEventListener("input", saveList);


        // Add elements to row
        row.append(checkbox, text);

        container.appendChild(row);

    }

});


/* ==========================================
   4. SAVE AND LOAD DATA
========================================== */

const storageKey = "personalHomeTodoListV2";

const status = document.getElementById("status");


// Collect all website data
function collectList() {

    const data = {

        name: document.getElementById("personName").value,

        date: document.getElementById("listDate").value,

        notes: document.getElementById("notes").value,

        sections: {}

    };


    sections.forEach(section => {

        data.sections[section.id] = [

            ...document.querySelectorAll(
                `#${section.id} .task-row`
            )

        ].map(row => ({

            text: row.querySelector(
                'input[type="text"]'
            ).value,

            done: row.querySelector(
                'input[type="checkbox"]'
            ).checked

        }));

    });

    return data;

}


// Save data in browser storage
function saveList() {

    localStorage.setItem(
        storageKey,
        JSON.stringify(collectList())
    );

    status.textContent =
        "Saved automatically in this browser.";

}


// Load saved data
function loadList() {

    const saved = localStorage.getItem(storageKey);


    if (!saved) {

        document.getElementById("listDate").value =
            new Date().toLocaleDateString("en-CA");

        return;

    }


    try {

        const data = JSON.parse(saved);


        document.getElementById("personName").value =
            data.name || MY_NAME;

        document.getElementById("listDate").value =
            data.date || "";

        document.getElementById("notes").value =
            data.notes || "";


        // Restore tasks, priorities and reminders
        sections.forEach(section => {

            const rows = document.querySelectorAll(
                `#${section.id} .task-row`
            );


            (data.sections?.[section.id] || []).forEach(
                (item, index) => {

                    if (!rows[index]) return;


                    rows[index].querySelector(
                        'input[type="text"]'
                    ).value = item.text || "";


                    const checkbox = rows[index].querySelector(
                        'input[type="checkbox"]'
                    );


                    checkbox.checked = Boolean(item.done);


                    rows[index].classList.toggle(
                        "done",
                        checkbox.checked
                    );

                }
            );

        });

    }

    catch (error) {

        status.textContent =
            "Could not load the saved list.";

    }

}


/* ==========================================
   5. AUTOMATIC SAVE EVENTS
========================================== */


// Save name
document.getElementById("personName")
    .addEventListener("input", saveList);


// Save date
document.getElementById("listDate")
    .addEventListener("change", saveList);


// Save notes
document.getElementById("notes")
    .addEventListener("input", saveList);


/* ==========================================
   6. SAVE BUTTON
========================================== */

document.getElementById("saveBtn").addEventListener("click", () => {

    saveList();

    status.textContent =
        "Your to-do list is saved.";

});


/* ==========================================
   7. PRINT BUTTON
========================================== */

document.getElementById("printBtn").addEventListener("click", () => {

    window.print();

});


/* ==========================================
   8. CLEAR ALL BUTTON
========================================== */

document.getElementById("clearBtn").addEventListener("click", () => {

    const confirmed = confirm(
        "Clear all tasks, priorities, reminders and notes?"
    );


    if (!confirmed) return;


    // Remove saved data
    localStorage.removeItem(storageKey);


    // Reset name, date and notes
    document.getElementById("personName").value = MY_NAME;

    document.getElementById("listDate").value =
        new Date().toLocaleDateString("en-CA");

    document.getElementById("notes").value = "";


    // Clear all text fields
    document.querySelectorAll(
        '.task-row input[type="text"]'
    ).forEach(input => {

        input.value = "";

    });


    // Uncheck all checkboxes
    document.querySelectorAll(
        '.task-row input[type="checkbox"]'
    ).forEach(input => {

        input.checked = false;

        input.closest(".task-row").classList.remove("done");

    });


    status.textContent = "List cleared.";

});


/* ==========================================
   9. START WEBSITE
========================================== */

loadList();