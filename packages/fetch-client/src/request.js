/**
 * Низкоуровневая логика одного HTTP-запроса.
 *
 * - сбор URL
 * - применение интерсепторов
 * - timeout / retry
 * - вызов fetch
 * - обработка ошибок
 */


import {HttpError} from "./errors.js";

/**
 *
 * @param {Object} config
 * @param {string} method
 * @param {string} path
 * @param {Object} options
 */
export async function request(config, method, path, options = {}) {

    let url = handleUrl(config.baseUrl, path);
    url += handleQuerySet(options.query);

    const prepareHeadersFromConfig = typeof config.headers === "function" ? config.headers() : {...(config.headers ?? "")}
    const headers = {...prepareHeadersFromConfig, ...(options.headers ?? {})};

    let body;
    if (options.json !== undefined) {
        body = JSON.stringify(options.json);
        if (!headers["Content-type"]) {
            headers["Content-type"] = "application/json";
        }
    }


    const res = await fetch(url, {headers, method, body});

    const responseBody = await res.text();

    if (!res.ok) {
        throw HttpError(res.status, responseBody)
    }

    if (!responseBody) {
        return null;
    }

    try {
        return JSON.parse(responseBody);
    } catch (e) {
        return responseBody;
    }

}


/**
 *
 * @param {string} baseUrl
 * @param {string} path
 *
 * @return {string}
 */
function handleUrl(baseUrl, path) {
    const url = baseUrl ?? "";
    const preparedUrl = url.replace(/\/+$/, "");
    const preparedPath = path.replace(/^\/+/, "");

    return `${preparedUrl}/${preparedPath}`;
}

/**
 *
 * @param {object}querySet
 * @return {string}
 */
function handleQuerySet(querySet) {
    if (!querySet || typeof querySet !== "object") {
        return "";
    }

    const queryString = new URLSearchParams();

    for (const [key, value] of Object.entries(querySet)) {
        if (value !== undefined) {
            queryString.set(key, value.toString());
        }
    }

    const result = queryString.toString();

    if (result) {
        return `?${result}`;
    }

    return "";

}