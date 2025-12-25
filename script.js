document.addEventListener("DOMContentLoaded", function() {
    const exercises = document.querySelectorAll(".exercise");

    function getToday() {
        return new Date().toISOString().split("T")[0];
    }

    // Lade Werte für einen bestimmten Tag
    function loadDay(date) {
        const saved = localStorage.getItem(date);

        exercises.forEach(ex => {
            const setsInput = ex.querySelector(".sets");
            const repsInput = ex.querySelector(".reps");
            const kgInput = ex.querySelector(".kg");
            if (!setsInput || !repsInput || !kgInput) return;

            if (saved) {
                let dayData;
                try { dayData = JSON.parse(saved); } catch { dayData = {}; }
                const key = ex.dataset.exercise;
                const data = dayData[key] || ["", "", ""];
                setsInput.value = data[0];
                repsInput.value = data[1];
                kgInput.value = data[2];
            } else {
                setsInput.value = "";
                repsInput.value = "";
                kgInput.value = "";
            }
        });
    }

    // Lade heutige Werte beim Start
    loadDay(getToday());

    // Speichern der Werte für heute
    document.getElementById("saveDay").addEventListener("click", () => {
        const today = getToday();
        const dayData = {};

        exercises.forEach(ex => {
            const key = ex.dataset.exercise;
            if (!key) return;
            const setsInput = ex.querySelector(".sets");
            const repsInput = ex.querySelector(".reps");
            const kgInput = ex.querySelector(".kg");
            if (!setsInput || !repsInput || !kgInput) return;

            dayData[key] = [
                setsInput.value || "",
                repsInput.value || "",
                kgInput.value || ""
            ];
        });

        localStorage.setItem(today, JSON.stringify(dayData));
        alert("Daten für " + today + " gespeichert!");
    });

    // Verlauf: nur Tage anzeigen
    document.getElementById("showHistory").addEventListener("click", () => {
        const historyDiv = document.getElementById("history");
        historyDiv.innerHTML = "";

        const days = Object.keys(localStorage)
            .filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k))
            .sort();

        if (days.length === 0) {
            historyDiv.innerHTML = "<p>Keine Daten vorhanden.</p>";
            return;
        }

        days.forEach(day => {
            const dayButton = document.createElement("button");
            dayButton.textContent = day;

            // Stil Tages-Buttons
            dayButton.style.display = "block";
            dayButton.style.width = "100%";
            dayButton.style.padding = "12px 10px";
            dayButton.style.margin = "8px 0";
            dayButton.style.border = "none";
            dayButton.style.borderRadius = "8px";
            dayButton.style.background = "#4CAF50";
            dayButton.style.color = "white";
            dayButton.style.fontSize = "16px";
            dayButton.style.fontWeight = "bold";
            dayButton.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            dayButton.style.cursor = "pointer";
            dayButton.style.transition = "all 0.2s";

            dayButton.addEventListener("mouseover", () => {
                dayButton.style.background = "#45a049";
                dayButton.style.transform = "scale(1.02)";
            });
            dayButton.addEventListener("mouseout", () => {
                dayButton.style.background = "#4CAF50";
                dayButton.style.transform = "scale(1)";
            });

            dayButton.addEventListener("click", () => {
                showDayDetails(day);
            });

            historyDiv.appendChild(dayButton);
        });
    });

    // Tagesdetails anzeigen (nur Übungen mit Werten)
    function showDayDetails(date) {
        const historyDiv = document.getElementById("history");
        historyDiv.innerHTML = "";

        const saved = localStorage.getItem(date);
        if (!saved) {
            historyDiv.innerHTML = "<p>Keine Daten für diesen Tag.</p>";
            return;
        }

        let dayData;
        try { dayData = JSON.parse(saved); } catch { dayData = {}; }

        // Datum Header
        const dayHeader = document.createElement("h2");
        dayHeader.textContent = date;
        dayHeader.style.textAlign = "center";
        dayHeader.style.marginBottom = "15px";
        historyDiv.appendChild(dayHeader);

        let hasExercises = false;

        for (const exName in dayData) {
            const [sets, reps, kg] = dayData[exName];

            if (sets || reps || kg) {
                hasExercises = true;

                const exCard = document.createElement("div");
                exCard.style.border = "1px solid #ccc";
                exCard.style.borderRadius = "10px";
                exCard.style.padding = "12px";
                exCard.style.marginBottom = "10px";
                exCard.style.background = "#f9f9f9";
                exCard.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                exCard.style.display = "flex";
                exCard.style.justifyContent = "space-between";
                exCard.style.alignItems = "center";

                const nameElem = document.createElement("span");
                nameElem.textContent = exName;
                nameElem.style.fontWeight = "bold";

                const valuesElem = document.createElement("span");
                valuesElem.textContent = `Sets: ${sets}, Reps: ${reps}, KG: ${kg}`;
                valuesElem.style.fontFamily = "monospace";

                exCard.appendChild(nameElem);
                exCard.appendChild(valuesElem);
                historyDiv.appendChild(exCard);
            }
        }

        if (!hasExercises) {
            const info = document.createElement("p");
            info.textContent = "Keine Übungen mit eingetragenen Werten an diesem Tag.";
            info.style.textAlign = "center";
            historyDiv.appendChild(info);
        }

        // Zurück-Button
        const backButton = document.createElement("button");
        backButton.textContent = "Zurück zu Tagen";
        backButton.style.display = "block";
        backButton.style.width = "50%";
        backButton.style.margin = "20px auto 0 auto";
        backButton.style.padding = "10px";
        backButton.style.border = "none";
        backButton.style.borderRadius = "8px";
        backButton.style.background = "#2196F3";
        backButton.style.color = "white";
        backButton.style.fontWeight = "bold";
        backButton.style.fontSize = "15px";
        backButton.style.cursor = "pointer";
        backButton.style.boxShadow = "0 3px 6px rgba(0,0,0,0.1)";
        backButton.style.transition = "all 0.2s";

        backButton.addEventListener("mouseover", () => {
            backButton.style.background = "#1976D2";
            backButton.style.transform = "scale(1.03)";
        });
        backButton.addEventListener("mouseout", () => {
            backButton.style.background = "#2196F3";
            backButton.style.transform = "scale(1)";
        });
        backButton.addEventListener("click", () => {
            document.getElementById("showHistory").click();
        });

        historyDiv.appendChild(backButton);
    }

    // Reset-Button
    document.getElementById("reset").addEventListener("click", () => {
        if (confirm("Alle Trainingsdaten löschen?")) {
            Object.keys(localStorage).forEach(key => {
                if (/^\d{4}-\d{2}-\d{2}$/.test(key)) localStorage.removeItem(key);
            });

            exercises.forEach(ex => {
                const setsInput = ex.querySelector(".sets");
                const repsInput = ex.querySelector(".reps");
                const kgInput = ex.querySelector(".kg");
                if (!setsInput || !repsInput || !kgInput) return;

                setsInput.value = "";
                repsInput.value = "";
                kgInput.value = "";
            });

            document.getElementById("history").innerHTML = "";
        }
    });
});
