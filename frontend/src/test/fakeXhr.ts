/**
 * A controllable XMLHttpRequest double for upload tests.
 *
 * WHY THIS EXISTS — and why it is not used anywhere else.
 *
 * Every other network call in this test suite goes through MSW against the real client,
 * deliberately. Uploads cannot: sending a `FormData` that contains a `File` through
 * jsdom's XMLHttpRequest under MSW's interceptor never settles — the request hangs until
 * the test times out. A plain-string XHR body works fine, so it is specifically the
 * jsdom multipart serialisation path, not our code.
 *
 * Rather than delete the coverage or leave a hanging test, the transport is replaced with
 * this double while the page, the store, the toasts and the job-polling logic all stay
 * real. The multipart body itself is verified separately and directly by the
 * `buildUploadForm` unit test, so the contract is not left unasserted.
 *
 * The limitation is recorded in docs/frontend/MORNING_REPORT-2.md.
 */

export interface FakeXhrRecord {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: FormData | null;
}

export interface FakeXhrController {
  /** Every request made while the double was installed. */
  requests: FakeXhrRecord[];
  /** Emit an upload-progress event on the most recent request. */
  progress: (loaded: number, total: number, lengthComputable?: boolean) => void;
  /** Complete the most recent request with a status and JSON body. */
  respond: (status: number, body: unknown) => void;
  /** Fail the most recent request at the transport layer. */
  fail: () => void;
  /** Restore the real XMLHttpRequest. */
  restore: () => void;
}

interface Instance {
  record: FakeXhrRecord;
  self: Record<string, unknown>;
}

/**
 * Installs the double. Call `restore()` in an afterEach.
 */
export function installFakeXhr(): FakeXhrController {
  const real = globalThis.XMLHttpRequest;
  const requests: FakeXhrRecord[] = [];
  const instances: Instance[] = [];

  class FakeXhr {
    status = 0;
    responseText = '';
    responseType = '';
    timeout = 0;
    readyState = 0;

    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    ontimeout: (() => void) | null = null;
    onabort: (() => void) | null = null;

    upload = {
      onprogress: null as ((event: { loaded: number; total: number; lengthComputable: boolean }) => void) | null,
    };

    private record: FakeXhrRecord = { method: '', url: '', headers: {}, body: null };

    open(method: string, url: string) {
      this.record.method = method;
      this.record.url = url;
      this.readyState = 1;
    }

    setRequestHeader(name: string, value: string) {
      this.record.headers[name] = value;
    }

    send(body: FormData | null) {
      this.record.body = body;
      requests.push(this.record);
      instances.push({ record: this.record, self: this as unknown as Record<string, unknown> });
    }

    abort() {
      this.onabort?.();
    }
  }

  // MSW's interceptor installs XMLHttpRequest as a non-writable property, so a plain
  // assignment throws in strict mode. Redefine the descriptor instead.
  const define = (value: typeof XMLHttpRequest) => {
    Object.defineProperty(globalThis, 'XMLHttpRequest', { value, writable: true, configurable: true });
    if (typeof window !== 'undefined') {
      Object.defineProperty(window, 'XMLHttpRequest', { value, writable: true, configurable: true });
    }
  };

  define(FakeXhr as unknown as typeof XMLHttpRequest);

  const latest = () => instances[instances.length - 1];

  return {
    requests,
    progress(loaded, total, lengthComputable = true) {
      const instance = latest();
      const upload = instance?.self.upload as FakeXhr['upload'] | undefined;
      upload?.onprogress?.({ loaded, total, lengthComputable });
    },
    respond(status, body) {
      const instance = latest();
      if (!instance) throw new Error('no XHR in flight');
      instance.self.status = status;
      instance.self.responseText = typeof body === 'string' ? body : JSON.stringify(body);
      (instance.self.onload as (() => void) | null)?.();
    },
    fail() {
      const instance = latest();
      (instance?.self.onerror as (() => void) | null)?.();
    },
    restore() {
      define(real);
    },
  };
}
