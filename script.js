let targets = {
    biology: [],
    physics: [],
    chemistry: []
};

let totalPoints = 0;

function addTarget(subject) {
    const input = document.getElementById(subject + "Input");
    const inputValue = input.value.trim();
    
    if (inputValue === "") {
        alert("Please enter a target.");
        return;
    }
    
    // Add target with initial timer (24 hours in seconds)
    const target = { text: inputValue, completed: false, timer: 86400 };
    targets[subject].push(target);
    input.value = "";

    // Render targets with countdown timer
    renderTargets(subject);

    // Start countdown timer for this target
    const intervalId = setInterval(() => {
        target.timer--;
        renderTargets(subject);
        if (target.timer === 0) {
            clearInterval(intervalId);
            handleTargetTimeout(subject, target);
        }
    }, 1000);
}

function toggleComplete(subject, index) {
    const target = targets[subject][index];
    target.completed = !target.completed;
    renderTargets(subject);

    if (target.completed) {
        totalPoints += 10;
        document.getElementById("totalPoints").textContent = `Total points: ${totalPoints}`;
        alert("You've completed a target! +10 points");
        // Add completed target to modal and remove from main screen
        showCompletedModal(subject, target.text);
        targets[subject].splice(index, 1);
    }
}

function renderTargets(subject) {
    const targetsContainer = document.getElementById(subject + "Targets");
    targetsContainer.innerHTML = "";

    targets[subject].forEach((target, index) => {
        const targetDiv = document.createElement("div");
        targetDiv.textContent = `${target.text} (${formatTime(target.timer)})`;

        if (target.completed) {
            targetDiv.classList.add("completed");
        }

        const completeButton = document.createElement("button");
        completeButton.textContent = target.completed ? "Undo" : "Complete";
        completeButton.onclick = () => toggleComplete(subject, index);

        targetDiv.appendChild(completeButton);
        targetsContainer.appendChild(targetDiv);
    });
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
}

function showCompletedTargets() {
    const modal = document.getElementById("completedTargetsModal");
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("completedTargetsModal");
    modal.style.display = "none";
}

function showCompletedModal(subject, targetText) {
    const completedTargetsList = document.getElementById(`completed${capitalizeFirstLetter(subject)}Targets`);
    const li = document.createElement("li");
    const now = new Date();
    const dateTimeString = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    li.textContent = `${targetText} - Completed on: ${dateTimeString}`;
    completedTargetsList.appendChild(li);
}

function handleTargetTimeout(subject, target) {
    totalPoints -= 20;
    document.getElementById("totalPoints").textContent = `Total points: ${totalPoints}`;
    alert(`Target incomplete: ${target.text}`);
    targets[subject] = targets[subject].filter(t => t !== target); // Remove target from list
    renderTargets(subject);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


