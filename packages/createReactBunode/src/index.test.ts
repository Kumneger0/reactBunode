import { beforeEach, expect, it, jest, describe } from 'bun:test';
import fs from 'fs-extra';
import prompt from 'prompt';
import { createNewApplication } from '.';


describe('creates new project', () => {
	beforeEach(() => {
		  jest.restoreAllMocks()
		})
	it('should prompt the user for input and create a new application with the typeScript', async () => {
		global.fetch = jest.fn().mockImplementation(() => {
			return Promise.resolve({
				json: () => Promise.resolve({ 'dist-tags': { latest: '0.0.14' } })
			});
		});
		const folderName = 'testFolderName'
		prompt.start = jest.fn();
	
		prompt.get = jest.fn().mockImplementation((schema, callback) => {
			const result = {
				folderName: folderName,
				typeScript: 'Y',
				installdependencies: 'N'
			};
			callback(null, result);
		});
	
		fs.outputFile = jest.fn().mockImplementation((path: string, content: string) => {});
		await createNewApplication();
		expect(prompt.start).toHaveBeenCalled();
		expect(prompt.get).toHaveBeenCalled();
		expect(fetch).toHaveBeenCalledWith('https://registry.npmjs.org/reactbunode');
		expect(fs.outputFile).toHaveBeenCalledTimes(9);
	});

	it('creates New Application without typescript', async () => {
		
	
	
			const folderName = 'testFolderName'
	
			prompt.get = jest.fn().mockImplementation((schema, callback) => {
			const result = {
				folderName: folderName,
				typeScript: 'N',
				installdependencies: 'N'
			};
			callback(null, result);
			});
			fs.outputFile = jest.fn().mockImplementation((path: string, content: string) => {});
	
	
		await createNewApplication();
	
		expect(prompt.start).toHaveBeenCalled();
		expect(prompt.get).toHaveBeenCalled();
		expect(fetch).toHaveBeenCalledWith('https://registry.npmjs.org/reactbunode');
		expect(fs.outputFile).toHaveBeenCalledTimes(8);
	})
})


