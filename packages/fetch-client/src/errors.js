/**
 * Кастомные ошибки клиента.
 *
 * Примеры:
 * HttpError
 * TimeoutError
 * AbortError
 *
 * Чтобы отличать сетевые ошибки от бизнес-ошибок и корректно делать retry.
 */

export class HttpError extends Error {
    constructor(status, body) {
        super(`HTTP status - ${status}`);
        this.name = "HttpError";
        this.status = status;
        this.body = body;
    }
}