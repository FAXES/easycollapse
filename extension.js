// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
var opened = true;
const Delay = (ms) => new Promise(res => setTimeout(res, ms));
var typerRun = false;
function activate(context) {
	var levels = 2
	let disposable = vscode.commands.registerCommand('easycollapse.easycollapse', function () {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			let document = editor.document;
			const documentText = document.getText();
			if(!documentText.includes('module.exports')) levels = 1;
		}

		if(opened) {
			opened = false;
			vscode.window.showInformationMessage('Folded functions in this file.');
			vscode.commands.executeCommand('editor.fold', {levels: levels, direction: 'down'});
			vscode.commands.executeCommand('editor.fold', {levels: levels, direction: 'up'});
			setTimeout(() => {
				vscode.commands.executeCommand('notifications.clearAll');
			}, 10000);
			
		} else {
			opened = true;
			vscode.window.showInformationMessage('Un-folded functions in this file.');
			vscode.commands.executeCommand('editor.unfold', {levels: levels, direction: 'down'});
			vscode.commands.executeCommand('editor.unfold', {levels: levels, direction: 'up'});
			setTimeout(() => {
				vscode.commands.executeCommand('notifications.clearAll');
			}, 10000);
			
		}
	});
	let typeit = vscode.commands.registerTextEditorCommand('easycollapse.typeit', async function (textEditor, edit) {
		typerRun = !typerRun;
		while (typerRun) {
			textEditor.insertSnippet(new vscode.SnippetString('TypeIt'), textEditor.selection.active);
			await Delay(1000);
			vscode.commands.executeCommand('undo');
			await Delay(1000);
		}	
	});
	context.subscriptions.push(disposable, typeit);
}


module.exports = {
	activate
}
