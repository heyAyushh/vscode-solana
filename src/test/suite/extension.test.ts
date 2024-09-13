import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { before, after } from 'mocha';
import * as sinon from 'sinon';

suite('Solana Extension Test Suite', () => {
    let showQuickPickStub: sinon.SinonStub;
    let showWarningMessageStub: sinon.SinonStub;

    before(async () => {
        // Activate the extension
        const ext = vscode.extensions.getExtension('your-extension-id');
        await ext?.activate();

        // Stub the showQuickPick and showWarningMessage methods
        showQuickPickStub = sinon.stub(vscode.window, 'showQuickPick');
        showWarningMessageStub = sinon.stub(vscode.window, 'showWarningMessage');
    });

    after(() => {
        // Restore the original methods
        showQuickPickStub.restore();
        showWarningMessageStub.restore();
        vscode.window.showInformationMessage('All tests done!');
    });

    test('Check CLI Installed Command', async () => {
        const clis = ['anchor', 'solana', 'solana-verify'];
        for (const cli of clis) {
            const result = await vscode.commands.executeCommand('vscode-anchor-view-programs.checkCliInstalled', cli);
            assert.strictEqual(typeof result, 'boolean', `Check CLI installed should return a boolean for ${cli}`);
        }
    });

    test('Install CLI Command', async () => {
        const clis = ['anchor', 'solana', 'solana-verify'];
        for (const cli of clis) {
            // Simulate user selecting "Install it"
            showWarningMessageStub.resolves('Install it');

            await vscode.commands.executeCommand('vscode-anchor-view-programs.addEntry', cli);

            // Verify CLI is now installed
            const installed = await vscode.commands.executeCommand('vscode-anchor-view-programs.checkCliInstalled', cli);
            assert.strictEqual(installed, true, `${cli} should be installed after running install command`);
        }
    });

    test('Refresh Entry Command', async () => {
        await vscode.commands.executeCommand('vscode-anchor-view-programs.refreshEntry');
        // Since this command doesn't return anything, we're just checking it executes without error
    });

    test('Build Command', async () => {
        await vscode.commands.executeCommand('vscode-anchor-view-programs.build');
        // You might want to add some assertions here to check if the build was successful
    });

    test('Build Verifiable Item Command', async () => {
        // Create a mock program item
        const mockProgramItem = {
            label: 'test-program',
            version: '0.1.0',
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            command: { command: 'vscode-anchor-view-programs.editEntry', title: '', arguments: ['test-program'] }
        };

        await vscode.commands.executeCommand('vscode-anchor-view-programs.buildVerifiableItem', mockProgramItem);
        // Add assertions to check if the verifiable build was successful
    });

    test('Edit Entry Command', async () => {
        const programName = 'test-program';
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        assert(workspaceFolder, 'No workspace folder found');

        const programDir = path.join(workspaceFolder.uri.fsPath, 'programs', programName);
        const libPath = path.join(programDir, 'src', 'lib.rs');

        // Ensure the directory and file exist
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(path.dirname(libPath)));
        await vscode.workspace.fs.writeFile(vscode.Uri.file(libPath), Buffer.from('// Test program'));

        await vscode.commands.executeCommand('vscode-anchor-view-programs.editEntry', programName);

        // Check if the file is opened
        const activeEditor = vscode.window.activeTextEditor;
        assert(activeEditor, 'No active text editor');
        assert.strictEqual(activeEditor.document.uri.fsPath, libPath, 'Incorrect file opened');
    });

    test('Perform Verifiable Build Command', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        assert(workspaceFolder, 'No workspace folder found');

        const programsDir = path.join(workspaceFolder.uri.fsPath, 'programs');
        const programDir = path.join(programsDir, 'test-program');
        
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(programDir));
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(path.join(programDir, 'Cargo.toml')),
            Buffer.from('[package]\nname = "test-program"\nversion = "0.1.0"\nedition = "2018"\n')
        );

        // Simulate user selecting the test program
        showQuickPickStub.resolves({ label: 'test-program' });

        await vscode.commands.executeCommand('extension.performVerifiableBuild');
        // Add assertions to check if the verifiable build was successful
    });
});