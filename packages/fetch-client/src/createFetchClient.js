/**
 * Фабрика клиента
 * - создаёт cache и inFlight через замыкание
 * - принимает глобальный конфиг (baseUrl, ttl, retry, headers и т.д.)
 * - возвращает методы get / post / put / delete
 *
 * Зачем:
 * Показывает ключевую идею: состояние клиента живёт внутри замыкания
 *
 *
 *
 * const api = createFetchClient({
 *   baseUrl: "https://example.com/api",
 *   ttl: 10_000,
 *   dedupe: true,
 *   retry: { attempts: 3, baseDelay: 200 },
 *   timeoutMs: 5000,
 *   headers: () => ({ Authorization: "Bearer ..." }), // может быть функция
 * });
 *
 * const users = await api.get("/users", { cacheKey: "users" });
 * const user = await api.get("/users/1");
 *
 * Сделай фабрику:
 *
 * Требования:
 *
 * createFetchClient(config) возвращает объект:
 * get(path, options)
 * post(path, options)
 * put(path, options)
 * delete(path, options)
 * эти методы просто вызывают request(config, METHOD, path, options)
 *
 * const api = createFetchClient({
 *   baseUrl: "https://jsonplaceholder.typicode.com",
 *   headers: () => ({
 *     Authorization: "Bearer token"
 *   })
 * });
 *
 * await api.get("/users");
 */
import {request} from "./request.js";

export function createFetchClient(config) {

    const methods = {
        GET: "GET",
        POST: "POST",
        PUT: "PUT",
        DELETE: "DELETE",
        PATCH: "PATCH",
    };

    const get = (path, options) => request(config, methods.GET, path, options);
    const post = (path, options) => request(config, methods.POST, path, options);
    const put = (path, options) => request(config, methods.PUT, path, options);
    const patch = (path, options) => request(config, methods.PATCH, path, options);

    return {
        get, post, put, patch,
        delete: (path, options) => request(config, methods.DELETE, path, options),
    };
}


