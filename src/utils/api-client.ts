import { RequestError } from "./request-error";

interface RequestOptions {
  baseUrl?: string;
  headers?: { [key: string]: string };
}

export enum ApiClientMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
  PUT = "PUT",
}

export interface ApiServiceOptions<T> extends ApiClientRequestConfig {
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (e: RequestError) => void;
  onSuccess?: (t: T) => void;
}

export interface ApiClientRequestConfig {
  baseURL?: string;
  query?: { [key: string]: string | string[] };
  method: ApiClientMethod;
  url: string;
  body?: string | FormData;
  headers?: { [header: string]: string };
}

export interface ApiClientResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers | { [key: string]: string };
}

const UNKNOWN_ERR = "An unknown error occurred.";
const UNKNOWN_ERR_STATUS = 500;

export class ApiClient {
  public headers: { [key: string]: string };
  private baseUrl: string;

  public constructor(options: RequestOptions = {}) {
    this.baseUrl = options.baseUrl || "";
    this.headers = options.headers || {};
  }

  public request<T>(
    config: ApiClientRequestConfig
  ): Promise<ApiClientResponse<T>> {
    const { baseURL, query, url, method, body, headers } = {
      ...{ baseURL: this.baseUrl, headers: this.headers },
      ...config,
    } as ApiClientRequestConfig;

    return fetch(this.parseUrl(baseURL + url, query), {
      method: method,
      body: body,
      headers: {
        Accept: "application/json",
        ...headers,
      },
    }).then((response) =>
      response.json().then((json) => ({
        data: json as T,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      }))
    );
  }

  public get(
    url: string,
    qs: { [key: string]: string | string[] } = {},
    headers: { [k: string]: string } = {}
  ) {
    return fetch(this.baseUrl + this.parseUrl(url, qs), {
      headers: this.parseHeaders(headers),
    })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  public delete(
    url: string,
    qs: { [key: string]: string | string[] } = {},
    headers: { [k: string]: string } = {}
  ) {
    return fetch(this.parseUrl(url, qs), {
      headers: this.parseHeaders(headers),
      method: "DELETE",
    })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  public post(
    url: string,
    body?: object,
    headersObj: { [k: string]: string } = {},
    qs: { [key: string]: string | string[] } = {}
  ) {
    return fetch(this.baseUrl + this.parseUrl(url, qs), {
      headers: this.parseHeaders(headersObj),
      body: body ? JSON.stringify(body) : null,
      method: "POST",
    })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  public put(
    url: string,
    body?: object,
    headersObj: { [k: string]: string } = {},
    qs: { [key: string]: string | string[] } = {}
  ) {
    return fetch(this.baseUrl + this.parseUrl(url, qs), {
      headers: this.parseHeaders(headersObj),
      body: body ? JSON.stringify(body) : null,
      method: "PUT",
    })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  public patch(
    url: string,
    body?: object,
    headersObj: { [k: string]: string } = {},
    qs: { [key: string]: string | string[] } = {}
  ) {
    return fetch(this.baseUrl + this.parseUrl(url, qs), {
      headers: this.parseHeaders(headersObj),
      body: body ? JSON.stringify(body) : null,
      method: "PATCH",
    })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  private handleResponse(response: Response) {
    return response.json().then((json) => ({
      body: json,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }));
  }

  private handleError(err: RequestError) {
    return Promise.reject(
      new RequestError(
        err.message ? err.message.toString() : UNKNOWN_ERR,
        err.statusCode || UNKNOWN_ERR_STATUS
      )
    );
  }

  private parseUrl(
    endpoint: string,
    qs?: { [key: string]: string | string[] }
  ) {
    let url = endpoint;
    if (qs) {
      const final = Object.keys(qs)
        .map((q) => {
          const encodedKey = encodeURIComponent(q);
          const value = qs[q];
          if (!value) return "";
          if (Array.isArray(value)) {
            return value
              .map(
                (nestedValue: string) =>
                  `${encodedKey}=${encodeURIComponent(nestedValue)}`
              )
              .join("&");
          }
          return `${encodedKey}=${encodeURIComponent(value)}`;
        })
        .filter((i) => i)
        .join("&");
      if (final.length) {
        url += endpoint.includes("?") ? "&" : "?";
      }
      url += final;
    }
    return url;
  }

  private parseHeaders(headers: { [key: string]: string }) {
    const h: Headers = new Headers();
    for (const header of Object.keys(this.headers)) {
      h.append(header, this.headers[header]);
    }
    h.append("Accept", "application/json");
    for (const header of Object.keys(headers)) {
      h.append(header, headers[header]);
    }
    return h;
  }
}
