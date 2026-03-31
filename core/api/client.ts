import { API_BASE_URL, API_TIMEOUT_MS } from "@/constants/index"
import {
    ApiError,
    InsufficientFundsError,
    NetworkError,
    ServiceUnavailableError
} from "./errors"

// manage specific domain errors
function parseError(response: Response): ApiError {

    if (response.status === 400) {
        return new InsufficientFundsError();
    }

    if (response.status === 503) {
        return new ServiceUnavailableError();
    }

  return new ApiError("unknown_api_error", "An unknown error occurred. Please try again later.", true, response.status)
}

// add a timeout to the fetch request
async function fetchWithTimeout(
    url: string,
    options?: RequestInit
): Promise<Response> {

    const controller = new AbortController()

    const timeout = setTimeout(() => {
        controller.abort();
    }, API_TIMEOUT_MS)

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        })
        return response;
    } catch {
        throw new NetworkError();
    } finally {
        clearTimeout(timeout);
    }
}

// make a request to the API
export async function request<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {

    const response = await fetchWithTimeout(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
        }
    )

    if (!response.ok) {
        throw parseError(response)
    }

    const data = await response.json();

    return data as T;
}
