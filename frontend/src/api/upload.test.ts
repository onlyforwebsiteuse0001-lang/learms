import { describe, expect, it } from 'vitest';
import {
  ACCEPTED_EXTENSIONS,
  ACCEPT_ATTRIBUTE,
  MAX_FILE_MB,
  buildUploadForm,
  formatBytes,
  validateFiles,
} from './upload';

/** Build a File of a stated size without allocating that many bytes. */
function fakeFile(name: string, sizeBytes: number, type = 'application/pdf'): File {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: sizeBytes });
  return file;
}

describe('validateFiles', () => {
  it('accepts every supported extension', () => {
    const files = ACCEPTED_EXTENSIONS.map((ext, index) => fakeFile(`scan-${index}${ext}`, 1024));
    expect(validateFiles(files).accepted).toHaveLength(ACCEPTED_EXTENSIONS.length);
  });

  it('is case-insensitive about the extension', () => {
    expect(validateFiles([fakeFile('NOTES.PDF', 2048)]).accepted).toHaveLength(1);
  });

  it('rejects an unsupported format', () => {
    const { accepted, rejected } = validateFiles([fakeFile('archive.zip', 2048)]);
    expect(accepted).toHaveLength(0);
    expect(rejected[0].reason).toBe('unsupported_format');
  });

  it('rejects a file with no extension at all', () => {
    expect(validateFiles([fakeFile('README', 512)]).rejected[0].reason).toBe('unsupported_format');
  });

  it('rejects an empty file before it wastes a round trip', () => {
    expect(validateFiles([fakeFile('blank.pdf', 0)]).rejected[0].reason).toBe('empty_file');
  });

  it('rejects a file over the server limit', () => {
    const tooBig = fakeFile('huge.pdf', (MAX_FILE_MB + 1) * 1024 * 1024);
    expect(validateFiles([tooBig]).rejected[0].reason).toBe('file_too_large');
  });

  it('accepts a file exactly at the limit', () => {
    const atLimit = fakeFile('exact.pdf', MAX_FILE_MB * 1024 * 1024);
    expect(validateFiles([atLimit]).accepted).toHaveLength(1);
  });

  it('rejects a duplicate of something already staged', () => {
    const existing = [fakeFile('notes.pdf', 1024)];
    const { accepted, rejected } = validateFiles([fakeFile('notes.pdf', 1024)], existing);
    expect(accepted).toHaveLength(0);
    expect(rejected[0].reason).toBe('duplicate');
  });

  it('treats same name with a different size as a different file', () => {
    const existing = [fakeFile('notes.pdf', 1024)];
    expect(validateFiles([fakeFile('notes.pdf', 2048)], existing).accepted).toHaveLength(1);
  });

  it('rejects a duplicate appearing twice within one drop', () => {
    const { accepted, rejected } = validateFiles([fakeFile('a.pdf', 10), fakeFile('a.pdf', 10)]);
    expect(accepted).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect(rejected[0].reason).toBe('duplicate');
  });

  it('checks duplicates before format, so a repeated bad file reports one reason', () => {
    const existing = [fakeFile('x.zip', 10)];
    expect(validateFiles([fakeFile('x.zip', 10)], existing).rejected[0].reason).toBe('duplicate');
  });

  it('partitions a mixed batch without dropping anything', () => {
    const files = [
      fakeFile('good.pdf', 1024),
      fakeFile('bad.exe', 1024),
      fakeFile('empty.png', 0),
      fakeFile('ok.jpg', 4096),
    ];
    const { accepted, rejected } = validateFiles(files);
    expect(accepted.map((f) => f.name)).toEqual(['good.pdf', 'ok.jpg']);
    expect(rejected.map((r) => r.reason)).toEqual(['unsupported_format', 'empty_file']);
  });
});

describe('ACCEPT_ATTRIBUTE', () => {
  it('is a comma-separated list usable directly by <input accept>', () => {
    expect(ACCEPT_ATTRIBUTE.split(',')).toEqual(ACCEPTED_EXTENSIONS);
    expect(ACCEPT_ATTRIBUTE).toContain('.pdf');
  });
});

describe('formatBytes', () => {
  it('uses bytes below 1 KB', () => {
    expect(formatBytes(512)).toBe('512 B');
  });

  it('uses kilobytes below 1 MB', () => {
    expect(formatBytes(2048)).toBe('2.0 KB');
  });

  it('uses megabytes above 1 MB', () => {
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB');
  });

  it('handles zero', () => {
    expect(formatBytes(0)).toBe('0 B');
  });
});

describe('buildUploadForm', () => {
  it('uses the field name the API requires', () => {
    // `upload_documents(files: list[UploadFile] = File(...))` — anything else 422s.
    const form = buildUploadForm([fakeFile('a.pdf', 10)]);
    expect([...form.keys()]).toEqual(['files']);
  });

  it('appends every file under the same repeated field', () => {
    const form = buildUploadForm([fakeFile('a.pdf', 10), fakeFile('b.pdf', 10)]);
    expect(form.getAll('files')).toHaveLength(2);
  });

  it('preserves the original filename, which the server stores and shows back', () => {
    const form = buildUploadForm([fakeFile('لیکچر ۱.pdf', 10)]);
    expect((form.get('files') as File).name).toBe('لیکچر ۱.pdf');
  });

  it('produces an empty body for an empty selection rather than throwing', () => {
    expect([...buildUploadForm([]).keys()]).toEqual([]);
  });
});
