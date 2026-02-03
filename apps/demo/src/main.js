import { createFetchClient } from "@zhele/fetch-client";



const api = createFetchClient({
    baseUrl: "https://jsonplaceholder.typicode.com"
});



document.querySelector("#app").innerHTML = `
  <h1>Fetch Client Demo</h1>
  <button id="btn">GET /users</button>
  <pre id="log"></pre>
`;

document.querySelector("#btn").addEventListener("click", async () => {
    const log = document.querySelector("#log");
    log.textContent = "Loading...\n";

    try {
        const users = await api.get("/users", { cacheKey: "users" });
        log.textContent += JSON.stringify(users, null, 2);
    } catch (e) {
        log.textContent += String(e?.message ?? e);
    }
});
