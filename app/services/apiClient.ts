import { clearClientSession } from '@/app/auth/utils/session';
import { APP_ROUTES } from '@/app/config/routes';

export type ApiListResult<T> = {
  items: T[];
  total: number;
};

export type ApiQuery = Record<
  string,
  string | number | boolean | null | undefined
>;

export type ApiError = {
  message: string;
  status?: number;
  details?: unknown;
};

type ApiEnvelope<T> = {
  data?: T;
  items?: T;
  message?: string | string[];
  error?: string | string[];
  statusCode?: number;
  success?: boolean;
  total?: number;
  count?: number;
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
).replace(/\/+$/, '');

const DEFAULT_ERROR_MESSAGE =
  'Không thể kết nối đến máy chủ. Vui lòng thử lại.';

const STATUS_ERROR_MESSAGES: Record<number, string> = {
  400: 'Dữ liệu gửi lên không hợp lệ.',
  401: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.',
  403: 'Bạn không có quyền thực hiện thao tác này.',
  404: 'Không tìm thấy dữ liệu hoặc đường dẫn API.',
  409: 'Dữ liệu đang bị trùng hoặc xảy ra xung đột.',
  422: 'Dữ liệu chưa đúng định dạng yêu cầu.',
  429: 'Bạn đang gửi quá nhiều yêu cầu. Vui lòng thử lại sau.',
  500: 'Máy chủ đang gặp lỗi. Vui lòng thử lại sau.',
  502: 'Máy chủ trung gian không nhận được phản hồi từ backend.',
  503: 'Dịch vụ hiện không khả dụng. Vui lòng thử lại sau.',
  504: 'Máy chủ phản hồi quá chậm. Vui lòng thử lại.',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFormData(value: unknown): value is FormData {
  return (
    typeof FormData !== 'undefined' &&
    value instanceof FormData
  );
}

function isBlob(value: unknown): value is Blob {
  return typeof Blob !== 'undefined' && value instanceof Blob;
}

function isUrlSearchParams(
  value: unknown,
): value is URLSearchParams {
  return (
    typeof URLSearchParams !== 'undefined' &&
    value instanceof URLSearchParams
  );
}

function isNgrokUrl(url: string): boolean {
  if (!url) return false;

  try {
    const hostname = new URL(url).hostname.toLowerCase();

    return (
      hostname.endsWith('.ngrok-free.app') ||
      hostname.endsWith('.ngrok-free.dev') ||
      hostname.endsWith('.ngrok.io')
    );
  } catch {
    return url.toLowerCase().includes('ngrok');
  }
}

function stringifyMessage(value: unknown): string | null {
  if (Array.isArray(value)) {
    const message = value
      .map((item) => String(item))
      .filter(Boolean)
      .join('\n');

    return message || null;
  }

  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  return null;
}

function extractErrorMessage(
  data: unknown,
  status?: number,
): string {
  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }

  if (isRecord(data)) {
    const message = stringifyMessage(data.message);

    if (message) {
      return message;
    }

    const error = stringifyMessage(data.error);

    if (error) {
      return error;
    }
  }

  if (status) {
    return (
      STATUS_ERROR_MESSAGES[status] ??
      DEFAULT_ERROR_MESSAGE
    );
  }

  return DEFAULT_ERROR_MESSAGE;
}

function buildUrl(path: string, query?: ApiQuery): string {
  const normalizedPath = path.startsWith('/')
    ? path
    : `/${path}`;

  const temporaryBase =
    API_BASE_URL ||
    (typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost');

  const url = new URL(normalizedPath, `${temporaryBase}/`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === ''
      ) {
        return;
      }

      url.searchParams.set(key, String(value));
    });
  }

  /**
   * Khi có NEXT_PUBLIC_API_BASE_URL:
   * https://backend.com/api/auth/profile
   *
   * Khi không có:
   * /api/auth/profile
   */
  if (API_BASE_URL) {
    return url.toString();
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem('accessToken');
}

function buildHeaders(
  init?: RequestInit,
  body?: unknown,
): Headers {
  const headers = new Headers(init?.headers);
  const accessToken = getAccessToken();

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  /**
   * Bỏ qua trang cảnh báo của ngrok Free.
   *
   * Chỉ thêm header khi API_BASE_URL thực sự là ngrok,
   * tránh tạo preflight không cần thiết ở môi trường khác.
   */
  if (
    isNgrokUrl(API_BASE_URL) &&
    !headers.has('ngrok-skip-browser-warning')
  ) {
    headers.set('ngrok-skip-browser-warning', 'true');
  }

  if (
    accessToken &&
    !headers.has('Authorization')
  ) {
    headers.set(
      'Authorization',
      `Bearer ${accessToken}`,
    );
  }

  /**
   * Không tự đặt Content-Type cho FormData.
   * Trình duyệt cần tự tạo boundary cho multipart/form-data.
   */
  if (
    body !== undefined &&
    body !== null &&
    !isFormData(body) &&
    !isBlob(body) &&
    !isUrlSearchParams(body) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  return headers;
}

function buildBody(body?: unknown): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (isFormData(body)) {
    return body;
  }

  if (isBlob(body)) {
    return body;
  }

  if (isUrlSearchParams(body)) {
    return body;
  }

  if (typeof body === 'string') {
    return body;
  }

  return JSON.stringify(body);
}

function looksLikeHtml(
  contentType: string,
  text: string,
): boolean {
  if (contentType.includes('text/html')) {
    return true;
  }

  const normalizedText = text.trim().toLowerCase();

  return (
    normalizedText.startsWith('<!doctype html') ||
    normalizedText.startsWith('<html') ||
    normalizedText.startsWith('<head') ||
    normalizedText.startsWith('<body')
  );
}

async function parseResponseSafely(
  response: Response,
): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  const contentType =
    response.headers
      .get('content-type')
      ?.toLowerCase() ?? '';

  if (looksLikeHtml(contentType, text)) {
    throw {
      message:
        'API trả về trang HTML thay vì dữ liệu JSON. Hãy kiểm tra NEXT_PUBLIC_API_BASE_URL, trạng thái backend và tunnel ngrok.',
      status: response.status,
      details: text.slice(0, 500),
    } satisfies ApiError;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function normalizeNetworkError(error: unknown): ApiError {
  if (
    isRecord(error) &&
    typeof error.message === 'string'
  ) {
    return {
      message: error.message,
      status:
        typeof error.status === 'number'
          ? error.status
          : undefined,
      details:
        'details' in error ? error.details : error,
    };
  }

  if (error instanceof Error) {
    return {
      message:
        error.message === 'Failed to fetch'
          ? 'Không thể kết nối đến backend. Hãy kiểm tra backend local, ngrok, CORS và NEXT_PUBLIC_API_BASE_URL.'
          : error.message,
      details: error,
    };
  }

  return {
    message: DEFAULT_ERROR_MESSAGE,
    details: error,
  };
}

export async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(path, {
      ...init,
      headers: buildHeaders(init, init?.body),
    });
  } catch (error) {
    throw normalizeNetworkError(error);
  }

  let data: unknown;

  try {
    data = await parseResponseSafely(response);
  } catch (error) {
    throw normalizeNetworkError(error);
  }

  if (!response.ok) {
    const apiError: ApiError = {
      message: extractErrorMessage(
        data,
        response.status,
      ),
      status: response.status,
      details: data,
    };

    if (response.status === 401 && typeof window !== 'undefined') {
      clearClientSession();

      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/auth/login')) {
        window.location.href = `${APP_ROUTES.Auth.LOGIN}?mode=login`;
      }
    }

    throw apiError;
  }

  return data as T;
}

export function unwrapData<T>(raw: unknown): T {
  if (isRecord(raw) && 'data' in raw) {
    return raw.data as T;
  }

  return raw as T;
}

export function normalizeListResponse<T>(
  raw: unknown,
): ApiListResult<T> {
  if (Array.isArray(raw)) {
    return {
      items: raw as T[],
      total: raw.length,
    };
  }

  if (isRecord(raw)) {
    const candidate = raw as ApiEnvelope<unknown>;

    const list = Array.isArray(candidate.items)
      ? candidate.items
      : Array.isArray(candidate.data)
        ? candidate.data
        : [];

    if (
      list.length > 0 ||
      Array.isArray(candidate.items) ||
      Array.isArray(candidate.data)
    ) {
      const totalValue =
        typeof candidate.total === 'number'
          ? candidate.total
          : typeof candidate.count === 'number'
            ? candidate.count
            : list.length;

      return {
        items: list as T[],
        total: totalValue,
      };
    }

    if (isRecord(candidate.data)) {
      const nestedResult =
        normalizeListResponse<T>(candidate.data);

      const totalValue =
        typeof candidate.total === 'number'
          ? candidate.total
          : typeof candidate.count === 'number'
            ? candidate.count
            : nestedResult.total;

      return {
        ...nestedResult,
        total: totalValue,
      };
    }
  }

  return {
    items: [],
    total: 0,
  };
}

export const apiClient = {
  get<T>(
    path: string,
    query?: ApiQuery,
    init?: RequestInit,
  ): Promise<T> {
    return request<T>(
      buildUrl(path, query),
      {
        ...init,
        method: 'GET',
      },
    );
  },

  post<T>(
    path: string,
    body?: unknown,
    init?: RequestInit,
  ): Promise<T> {
    const requestBody = buildBody(body);

    return request<T>(buildUrl(path), {
      ...init,
      method: 'POST',
      body: requestBody,
    });
  },

  put<T>(
    path: string,
    body?: unknown,
    init?: RequestInit,
  ): Promise<T> {
    const requestBody = buildBody(body);

    return request<T>(buildUrl(path), {
      ...init,
      method: 'PUT',
      body: requestBody,
    });
  },

  patch<T>(
    path: string,
    body?: unknown,
    init?: RequestInit,
  ): Promise<T> {
    const requestBody = buildBody(body);

    return request<T>(buildUrl(path), {
      ...init,
      method: 'PATCH',
      body: requestBody,
    });
  },

  delete<T>(
    path: string,
    init?: RequestInit,
  ): Promise<T> {
    return request<T>(buildUrl(path), {
      ...init,
      method: 'DELETE',
    });
  },
};