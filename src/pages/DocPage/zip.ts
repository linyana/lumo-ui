/**
 * A zip of text files, stored rather than deflated.
 *
 * What the manual hands over is a handful of files of a few kilobytes, already on this side as
 * strings: compressing them would cost a dependency and a library's worth of code for a size
 * nobody reads. The paths are the point — a zip unzipped at the project's root lands every file
 * exactly where the imports below it say it lives.
 *
 * The format is written by hand because it is three headers and a checksum: a local header per
 * file with the bytes after it, one central directory naming where each of those sits, and an end
 * record saying where the directory ends.
 */

export type ZipFile = { path: string; text: string };

const encoder = new TextEncoder();

/** The date every entry carries: 1980-01-01, the earliest the format can write, so the same files
 *  always make the same bytes. */
const DOS_DATE = 0x0021;

/** CRC-32, which the format keeps in every header whether or not the bytes were compressed. */
const CRC = (() => {
	const table = new Uint32Array(256);
	for (let index = 0; index < 256; index += 1) {
		let value = index;
		for (let bit = 0; bit < 8; bit += 1) {
			value = (value & 1) === 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
		}
		table[index] = value >>> 0;
	}
	return table;
})();

function crc32(bytes: Uint8Array) {
	let crc = 0xffffffff;
	for (const byte of bytes) crc = CRC[(crc ^ byte) & 0xff]! ^ (crc >>> 8);
	return (crc ^ 0xffffffff) >>> 0;
}

/** The files as one archive, UTF-8 names and UTF-8 contents, nothing compressed. */
export function zipOf(files: ZipFile[]): Blob {
	const entries = files.map((file) => {
		const name = encoder.encode(file.path);
		const data = encoder.encode(file.text);
		return { name, data, crc: crc32(data) };
	});

	const local = entries.reduce(
		(size, entry) => size + 30 + entry.name.length + entry.data.length,
		0,
	);
	const central = entries.reduce((size, entry) => size + 46 + entry.name.length, 0);
	const bytes = new Uint8Array(local + central + 22);
	const view = new DataView(bytes.buffer);
	let cursor = 0;

	const u16 = (value: number) => {
		view.setUint16(cursor, value, true);
		cursor += 2;
	};
	const u32 = (value: number) => {
		view.setUint32(cursor, value, true);
		cursor += 4;
	};
	const raw = (value: Uint8Array) => {
		bytes.set(value, cursor);
		cursor += value.length;
	};

	/** One local header and its bytes, per file: the signature, the sizes, the name, the text. */
	const offsets: number[] = [];
	for (const entry of entries) {
		offsets.push(cursor);
		u32(0x04034b50);
		u16(20);
		// Bit 11: the name is UTF-8, not the format's own code page.
		u16(0x0800);
		u16(0);
		u16(0);
		u16(DOS_DATE);
		u32(entry.crc);
		u32(entry.data.length);
		u32(entry.data.length);
		u16(entry.name.length);
		u16(0);
		raw(entry.name);
		raw(entry.data);
	}

	/** The directory: everything above, said again in one place, and where each file starts. */
	const directory = cursor;
	entries.forEach((entry, index) => {
		u32(0x02014b50);
		u16(20);
		u16(20);
		u16(0x0800);
		u16(0);
		u16(0);
		u16(DOS_DATE);
		u32(entry.crc);
		u32(entry.data.length);
		u32(entry.data.length);
		u16(entry.name.length);
		u16(0);
		u16(0);
		u16(0);
		u16(0);
		u32(0);
		u32(offsets[index]!);
		raw(entry.name);
	});

	const size = cursor - directory;
	u32(0x06054b50);
	u16(0);
	u16(0);
	u16(entries.length);
	u16(entries.length);
	u32(size);
	u32(directory);
	u16(0);

	return new Blob([bytes], { type: 'application/zip' });
}
