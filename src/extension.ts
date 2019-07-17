import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.generateAccessor', () =>
	{
		generateAccessor(true, true);
	});

	let disposableG = vscode.commands.registerCommand('extension.generateAccessorG', () =>
	{
		generateAccessor(true, false);
	});

	let disposableS = vscode.commands.registerCommand('extension.generateAccessorS', () =>
	{
		generateAccessor(false, true);
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposableG);
	context.subscriptions.push(disposableS);
}

// Generate accessor function
function generateAccessor(isGetter: boolean, isSetter: boolean)
{
	// Get active editor
	var editor = vscode.window.activeTextEditor;
	if (!editor) { return; }

	// Get selection line text
	var selection = editor.selection;
	var selectionLine = editor.document.lineAt(selection.start.line).range;
	var lineText = editor.document.getText(selectionLine);

	// Shallow check variable under bar
	if (lineText.indexOf('_') == -1) {
		vscode.window.showErrorMessage("Required '_' beginning of variable.");
		return;
	}

	// Cut head space
	var lineTextHeadSpace = countHeadSpace(lineText);
	var lineTextCutHeadSpace = lineText.substring(lineTextHeadSpace, lineText.length);
	var headSpace = Space(lineTextHeadSpace);

	// Get type variable pair in line text
	var pair = getTypeVariablePair(lineTextCutHeadSpace);
	if (!pair.isSetPair) { return; }

	// Generation code
	var code = '';
	code += headSpace + 'public ' + pair.type + ' ' + pair.variable + ' {';
	if (isGetter && isSetter) {
		code += '\n';
		code += headSpace + '    get { return _' + pair.variable + '; }\n';
		code += headSpace + '    set { _' + pair.variable + ' = value; }\n';
		code += headSpace;
	}
	else if (isGetter) { code += ' get { return _' + pair.variable + '; } '; }
	else if (isSetter) { code += ' set { _' + pair.variable + ' = value; } '; }
	code += '}';

	// Write code
	writeCode(editor, code);
}

// Count head spaces in param text
function countHeadSpace(text: string) : number
{
	var count = 0;
	while (count < text.length) {
		if (text[count] != ' ') {
			break;
		}
		count++;
	}

	return count;
}

// Generate space strings of param qty
function Space(spaceQty: number) : string
{
	var str = '';
	for (var i = 0; i < spaceQty; i++) { str += ' '; }
	return str;
}

// Type variable Pair Type
class TypeVariablePair
{
	type: string = '';
	variable: string = '';

	isSetType: boolean = false;
	isSetVariable: boolean = false;
	isSetPair: boolean = false;
}

// Get type variable pair in declaration line
function getTypeVariablePair (decCode: string) : TypeVariablePair
{
	// Generate return value pair
	var pair: TypeVariablePair = new TypeVariablePair();

	// Cut semicolon after code
	var semicolonID = decCode.indexOf(';');
	if (semicolonID == -1) { return pair; }
	var temp = decCode.substring(0, semicolonID);

	// Cut equal after code (cut init value)
	var equalID = temp.indexOf('=');
	if (equalID > -1) {
		temp = temp.substring(0, equalID);
	}

	// Split space
	var splitSpace = temp.split(' ');

	// Loop from the back
	var id = splitSpace.length - 1;
	while (id >= 0)
	{
		// if is there code
		if (splitSpace[id].length > 0)
		{
			// variable
			if (!pair.isSetVariable) {
				if (splitSpace[id].indexOf('_') == 0) {
					pair.variable = splitSpace[id].substring(1);
					pair.isSetVariable = true;
				}
			}

			// type
			else if (!pair.isSetType) {
				pair.type = splitSpace[id];
				pair.isSetType = true;
				pair.isSetPair = true;
			}
		}

		if (pair.isSetPair) { break; }
		id--;
	}

	// Return result
	return pair;
}

// Write code
function writeCode(editor: vscode.TextEditor, text: string) : void
{
	var selection = editor.selection;
	var selectionLine = editor.document.lineAt(selection.start.line).range;

	editor.edit(edit => {
		edit.insert(selectionLine.end, '\n' + text);
	});
}

// このメソッドはあなたの拡張機能が無効になったときに呼ばれます
export function deactivate() {}

/*
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "c-sharp-accessor-generator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
*/