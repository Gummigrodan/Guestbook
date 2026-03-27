const form = document.getElementById("guestForm");
const messageDiv = document.getElementById("messages");

async function loadMessages() {
    const res = await fetch("/messages");
    const data = await res.json();
    messageDiv.innerHTML = data.map(m => `<p><strong>${m.name}</strong>: ${m.message}</p>`).join("");
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const message = document.getElementById("message").value;

    await fetch("/messages", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, message})
    })

    form.reset();
    loadMessages();
});

loadMessages();