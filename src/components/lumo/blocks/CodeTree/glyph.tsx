import { createElement } from 'react';
import {
	File,
	FileCode2,
	FileCog,
	FileDiff,
	FileImage,
	FileJson,
	FileLock,
	FileSpreadsheet,
	FileTerminal,
	FileText,
	Palette,
	type LucideIcon,
} from 'lucide-react';

/** A file's glyph, read off its name: the whole name first, then the longest dotted suffix, so
 *  `vite.config.ts` is a config file before it is TypeScript. */
const BY_NAME: Record<string, LucideIcon> = {
	'package.json': FileCog,
	'tsconfig.json': FileCog,
	'jsconfig.json': FileCog,
	'bun.lock': FileLock,
	'bun.lockb': FileLock,
	'yarn.lock': FileLock,
	'package-lock.json': FileLock,
	'pnpm-lock.yaml': FileLock,
};

const BY_SUFFIX: Record<string, LucideIcon> = {
	// Code.
	ts: FileCode2,
	tsx: FileCode2,
	mts: FileCode2,
	cts: FileCode2,
	js: FileCode2,
	jsx: FileCode2,
	mjs: FileCode2,
	cjs: FileCode2,
	vue: FileCode2,
	svelte: FileCode2,
	astro: FileCode2,
	html: FileCode2,
	xml: FileCode2,
	// Styles, and markup that is drawn.
	css: Palette,
	scss: Palette,
	sass: Palette,
	less: Palette,
	svg: FileImage,
	// Data and configuration.
	json: FileJson,
	jsonc: FileJson,
	json5: FileJson,
	yaml: FileCog,
	yml: FileCog,
	toml: FileCog,
	ini: FileCog,
	env: FileCog,
	csv: FileSpreadsheet,
	tsv: FileSpreadsheet,
	// Prose.
	md: FileText,
	mdx: FileText,
	txt: FileText,
	rst: FileText,
	// Shells, patches, locks.
	sh: FileTerminal,
	bash: FileTerminal,
	zsh: FileTerminal,
	fish: FileTerminal,
	ps1: FileTerminal,
	diff: FileDiff,
	patch: FileDiff,
	lock: FileLock,
	// Images.
	png: FileImage,
	jpg: FileImage,
	jpeg: FileImage,
	gif: FileImage,
	webp: FileImage,
	avif: FileImage,
	ico: FileImage,
};

/** The glyph a leaf is drawn with, or a plain file for a type the tables do not know. */
function glyphOf(name: string): LucideIcon {
	const leaf = name.toLowerCase();
	const byName = BY_NAME[leaf];
	if (byName) return byName;

	const segments = leaf.split('.');
	for (let index = 1; index < segments.length; index += 1) {
		const bySuffix = BY_SUFFIX[segments.slice(index).join('.')];
		if (bySuffix) return bySuffix;
	}
	return File;
}

/** The element a row passes as its `icon` — picked per row, so it is built here rather than named
 *  at the call site, where a component chosen during render would be a new one every frame. */
export function fileGlyph(name: string) {
	return createElement(glyphOf(name), { 'aria-hidden': true });
}
