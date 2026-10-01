import {
  HttpResponse,
  act,
  fireEvent,
  http,
  renderWithProviders,
  resetStores,
  screen,
  server,
  signIn,
  userEvent,
  waitFor,
} from '../../frontend/src/test/harness';
import { installFakeXhr } from '../../frontend/src/test/fakeXhr';
import type { FakeXhrController } from '../../frontend/src/test/fakeXhr';
import { UploadPage } from '../../frontend/src/pages/Upload';
import { Toasts } from '../../frontend/src/components/ui/Toasts';

/**
 * Upload is the one flow that does not use the shared fetch client — it uses
 * XMLHttpRequest so it can report real transferred bytes rather than a timer animation.
 *
 * The transport is the only thing doubled here (see `fakeXhr.ts` for why jsdom forces
 * that); the page, validation, toasts, progress bar and the job polling that follows the
 * 202 are all real, and the job poll still goes through MSW. The multipart body itself is
 * asserted directly by the `buildUploadForm` unit test.
 */

function fakeFile(name: string, sizeBytes = 2048, type = 'application/pdf'): File {
  const file = new File(['content'], name, { type });
  Object.defineProperty(file, 'size', { value: sizeBytes });
  return file;
}

const renderUpload = () =>
  renderWithProviders(
    <>
      <UploadPage />
      <Toasts />
    </>,
    { authenticated: true },
  );

const fileInput = () => screen.getByLabelText(/choose files/i) as HTMLInputElement;

/**
 * `userEvent.upload` silently filters anything the input's `accept` attribute excludes,
 * which would make it impossible to test how the page reacts to a bad file. Firing the
 * change event directly reproduces what a real drag-and-drop does.
 */
function pickFiles(files: File[]) {
  const input = fileInput();
  Object.defineProperty(input, 'files', { value: files, configurable: true });
  fireEvent.change(input);
}

const acceptedJob = {
  job_id: 'job-1',
  total_files: 1,
  completed_files: 1,
  failed_files: 0,
  status: 'success',
  created_at: '2026-09-20T10:00:00Z',
  updated_at: '2026-09-20T10:00:05Z',
};

const accepted202Body = {
  job_id: 'job-1',
  status: 'queued',
  files: [
    { file_id: 'doc-1', original_name: 'notes.pdf', size_bytes: 2048, mime_type: 'application/pdf', status: 'queued' },
  ],
  message: '1 file queued / 1 file qatar mein',
};

let xhr: FakeXhrController;

beforeEach(() => {
  resetStores();
  signIn();
  xhr = installFakeXhr();
});

afterEach(() => {
  xhr.restore();
});

describe('UploadPage — choosing files', () => {
  it('shows the accepted formats up front so a rejection is never a surprise', () => {
    renderUpload();
    expect(screen.getByText('PDF · DOCX · PPTX · JPG · PNG · TIFF · BMP')).toBeInTheDocument();
  });

  it('keeps the file picker keyboard operable, not mouse-only drag and drop', () => {
    renderUpload();
    expect(fileInput()).toHaveAttribute('type', 'file');
    expect(fileInput()).toHaveAttribute('accept', expect.stringContaining('.pdf'));
  });

  it('stages a selected file and shows its size', async () => {
    renderUpload();
    await userEvent.upload(fileInput(), fakeFile('notes.pdf', 2048));
    expect(await screen.findByText('notes.pdf')).toBeInTheDocument();
    expect(screen.getByText('2.0 KB')).toBeInTheDocument();
  });

  it('refuses an unsupported format with a reason naming the file', async () => {
    renderUpload();
    pickFiles([fakeFile('virus.exe', 1024, 'application/octet-stream')]);
    expect(await screen.findByText('"virus.exe" is not a supported format.')).toBeInTheDocument();
    expect(screen.queryByText('Selected files')).not.toBeInTheDocument();
  });

  it('refuses a file over the size limit before spending the student\u2019s data', async () => {
    renderUpload();
    pickFiles([fakeFile('huge.pdf', 60 * 1024 * 1024)]);
    expect(await screen.findByText('"huge.pdf" is larger than the 50 MB limit.')).toBeInTheDocument();
  });

  it('refuses an empty file', async () => {
    renderUpload();
    pickFiles([fakeFile('blank.pdf', 0)]);
    expect(await screen.findByText('"blank.pdf" is empty.')).toBeInTheDocument();
  });

  it('rejects a duplicate of a file already staged', async () => {
    renderUpload();
    pickFiles([fakeFile('notes.pdf')]);
    await screen.findByText('notes.pdf');
    pickFiles([fakeFile('notes.pdf')]);
    expect(await screen.findByText('"notes.pdf" is already in the list.')).toBeInTheDocument();
  });

  it('keeps the good files from a mixed selection', async () => {
    renderUpload();
    pickFiles([fakeFile('good.pdf'), fakeFile('bad.exe', 1024, 'application/octet-stream')]);
    expect(await screen.findByText('good.pdf')).toBeInTheDocument();
    expect(await screen.findByText('"bad.exe" is not a supported format.')).toBeInTheDocument();
  });

  it('lets a staged file be removed again', async () => {
    renderUpload();
    pickFiles([fakeFile('notes.pdf')]);
    await screen.findByText('notes.pdf');
    await userEvent.click(screen.getByRole('button', { name: 'Remove: notes.pdf' }));
    expect(screen.queryByText('notes.pdf')).not.toBeInTheDocument();
  });
});

describe('UploadPage — sending', () => {
  it('posts multipart to the documents upload endpoint with the bearer token', async () => {
    renderUpload();
    pickFiles([fakeFile('notes.pdf')]);
    await screen.findByText('notes.pdf');
    await userEvent.click(screen.getByRole('button', { name: 'Upload and process' }));

    await waitFor(() => expect(xhr.requests).toHaveLength(1));
    const request = xhr.requests[0];
    expect(request.method).toBe('POST');
    expect(request.url).toBe('/api/v1/documents/upload');
    expect(request.headers.Authorization).toMatch(/^Bearer /);
    // The browser must set the multipart boundary itself.
    expect(request.headers['Content-Type']).toBeUndefined();
    expect([...(request.body as FormData).keys()]).toContain('files');
  });

  it('reports real transferred bytes rather than an animated guess', async () => {
    renderUpload();
    pickFiles([fakeFile('notes.pdf')]);
    await screen.findByText('notes.pdf');
    await userEvent.click(screen.getByRole('button', { name: 'Upload and process' }));
    await waitFor(() => expect(xhr.requests).toHaveLength(1));

    act(() => xhr.progress(512, 2048));
    const bar = await screen.findByRole('progressbar', { name: 'Upload progress' });
    expect(bar).toHaveAttribute('aria-valuenow', '25');
  });

  it('falls back to an indeterminate bar when the browser cannot compute progress', async () => {
    renderUpload();
    pickFiles([fakeFile('notes.pdf')]);
    await screen.findByText('notes.pdf');
    await userEvent.click(screen.getByRole('button', { name: 'Upload and process' }));
    await waitFor(() => expect(xhr.requests).toHaveLength(1));

    act(() => xhr.progress(0, 0, false));
    const bar = await screen.findByRole('progressbar', { name: 'Upload progress' });
    // No invented percentage.
    expect(bar).not.toHaveAttribute('aria-valuenow');
  });

  it('tracks the processing job after the upload is accepted', async () => {
    server.use(http.get('/api/v1/jobs/:jobId', () => HttpResponse.json(acceptedJob)));

    renderUpload();
    pickFiles([fakeFile('notes.pdf')]);
    await screen.findByText('notes.pdf');
    await userEvent.click(screen.getByRole('button', { name: 'Upload and process' }));
    await waitFor(() => expect(xhr.requests).toHaveLength(1));
    act(() => xhr.respond(202, accepted202Body));

    expect(await screen.findByText('Files uploaded. Processing has started.')).toBeInTheDocument();
    expect(await screen.findByRole('progressbar', { name: 'Processing progress' })).toBeInTheDocument();
    // The staged list is cleared only once the server has accepted the batch.
    await waitFor(() => expect(screen.queryByText('Selected files')).not.toBeInTheDocument());
  }, 15_000);

  it('offers a retry when the job reports failed files', async () => {
    server.use(
      http.get('/api/v1/jobs/:jobId', () =>
        HttpResponse.json({ ...acceptedJob, completed_files: 0, failed_files: 1, status: 'failed' }),
      ),
    );

    renderUpload();
    pickFiles([fakeFile('notes.pdf')]);
    await screen.findByText('notes.pdf');
    await userEvent.click(screen.getByRole('button', { name: 'Upload and process' }));
    await waitFor(() => expect(xhr.requests).toHaveLength(1));
    act(() => xhr.respond(202, accepted202Body));

    expect(await screen.findByRole('button', { name: 'Retry failed files' })).toBeInTheDocument();
  }, 15_000);

  it('reports a server rejection instead of pretending the upload worked', async () => {
    renderUpload();
    pickFiles([fakeFile('notes.pdf')]);
    await screen.findByText('notes.pdf');
    await userEvent.click(screen.getByRole('button', { name: 'Upload and process' }));
    await waitFor(() => expect(xhr.requests).toHaveLength(1));
    act(() =>
      xhr.respond(413, { error: 'file_too_large', message: 'File exceeds the size limit / File hadd se bari hai' }),
    );

    expect(await screen.findByText('File exceeds the size limit')).toBeInTheDocument();
    // The file stays staged so the student can retry rather than re-pick it.
    expect(screen.getByText('notes.pdf')).toBeInTheDocument();
  });

  it('explains a dropped connection mid-upload', async () => {
    renderUpload();
    pickFiles([fakeFile('notes.pdf')]);
    await screen.findByText('notes.pdf');
    await userEvent.click(screen.getByRole('button', { name: 'Upload and process' }));
    await waitFor(() => expect(xhr.requests).toHaveLength(1));
    act(() => xhr.fail());

    expect(await screen.findByText(/connection|network|reach/i)).toBeInTheDocument();
  });
});
