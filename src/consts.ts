/**
 * HTTP header to correlate requests made while intercepting
 */
export const YESNO_INTERNAL_HTTP_HEADER: string = 'x-yesno-internal-header-id';

/**
 * JSON mime type
 */
export const MIME_TYPE_JSON: string = 'application/json';

/**
 * HTTP content type header
 */
export const HEADER_CONTENT_TYPE: string = 'content-type';

/**
 * Default symbol to use when redacting fields from HTTP requests
 */
export const DEFAULT_REDACT_SYMBOL: string = '*****';

/**
 * Default port for outbound HTTP requests
 */
export const DEFAULT_PORT_HTTP: number = 80;

/**
 * Default port for outbound HTTPS requests
 */
export const DEFAULT_PORT_HTTPS: number = 443;

/**
 * Environment variable controlling the current recording mode
 */
export const YESNO_RECORDING_MODE_ENV_VAR: string = 'YESNO_RECORDING_MODE';
