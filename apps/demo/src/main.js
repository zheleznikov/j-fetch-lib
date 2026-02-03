import { createFetchClient } from "@zhele/fetch-client";

const api = createFetchClient({
    baseUrl: "https://example.com/api",
    ttl: 10_000,
    dedupe: true,
    retry: { attempts: 3, baseDelay: 200 },
    timeoutMs: 5_000,
    headers: () => ({ Authorization: "Bearer ..." })
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
