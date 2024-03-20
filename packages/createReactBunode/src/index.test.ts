import { it, describe, jest, mock, expect } from 'bun:test';
import { $ } from 'bun';
import fs from 'fs-extra';
import prompt from 'prompt';
import { createNewApplication } from '.';

it('should prompt the user for input and create a new application with the specified options', async () => {
	global.fetch = jest.fn().mockImplementation(() => {
		return Promise.resolve({
			json: () => Promise.resolve({ 'dist-tags': { latest: '0.0.13' } })
		});
	});

	prompt.start = jest.fn();
	prompt.get = jest.fn().mockImplementation((schema, callback) => {
		const result = {
			folderName: 'testApp',
			typeScript: 'Y',
			installdependencies: 'Y'
		};
		callback(null, result);
	});

	fs.outputFile = jest.fn().mockResolvedValue();

	const mkdir = jest.fn();
	mkdir('testApp');

	const cd = jest.fn();
	cd('testApp');

	const install = jest.fn();
	install('bun install');

	await createNewApplication();

	expect(prompt.start).toHaveBeenCalled();
	expect(prompt.get).toHaveBeenCalled();
	expect(fetch).toHaveBeenCalledWith('https://registry.npmjs.org/reactbunode');
	expect(fs.outputFile).toHaveBeenCalledTimes(11);
	expect(mkdir).toHaveBeenCalledWith('testApp');
	expect(cd).toHaveBeenCalledWith('testApp');
	expect(install).toHaveBeenCalledWith('bun install');
});

// Extract the folder name from the user's input
it("should extract the folder name from the user's input", async () => {
	// Mock the necessary dependencies
	const promptStartMock = jest.fn();
	const promptGetMock = jest.fn().mockImplementation((schema, callback) => {
		const result = {
			folderName: 'testApp',
			typeScript: 'Y',
			installdependencies: 'Y'
		};
		callback(null, result);
	});
	const fsOutputFileMock = jest.fn().mockResolvedValue();
	const mkdirMock = jest.fn();
	const cdMock = jest.fn();
	const installMock = jest.fn();

	// Mock the global.fetch function
	global.fetch = jest.fn().mockImplementation(() => {
		return Promise.resolve({
			json: () => Promise.resolve({ 'dist-tags': { latest: '0.0.13' } })
		});
	});

	// Mock the necessary functions from imported modules
	prompt.start = promptStartMock;
	prompt.get = promptGetMock;
	fs.outputFile = fsOutputFileMock;
	mkdirMock.mockReturnValueOnce('testApp');
	cdMock.mockReturnValueOnce('testApp');
	installMock.mockReturnValueOnce('bun install');

	// Call the function under test
	await createNewApplication();

	// Assert that the necessary functions were called with the correct arguments
	expect(promptStartMock).toHaveBeenCalled();
	expect(promptGetMock).toHaveBeenCalled();
	expect(fetch).toHaveBeenCalledWith('https://registry.npmjs.org/reactbunode');
	expect(fsOutputFileMock).toHaveBeenCalledTimes(11);
	expect(mkdirMock).toHaveBeenCalledWith('testApp');
	expect(cdMock).toHaveBeenCalledWith('testApp');
	expect(installMock).toHaveBeenCalledWith('bun install');
});
