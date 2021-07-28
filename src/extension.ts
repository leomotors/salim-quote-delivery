import * as vscode from 'vscode';
import fetch from "node-fetch";

const SalimAPIUrl: string = "https://watasalim.vercel.app/api/quotes"
let QuoteArray: string[] = []

export async function activate(context: vscode.ExtensionContext) {

	fetch(SalimAPIUrl, {
		method: "GET",
		headers: { "Content-type": "application/json;charset=UTF-8" }
	}).then(response => response.json())
		.then(json => {
			for (let quote of json.quotes) {
				let toAdd = quote.body
				if (QuoteArray.includes(toAdd))
					console.log(`[IMPORT WARNING] Duplicate Quote : ${toAdd}`)
				else
					QuoteArray.push(toAdd)
			}
			console.log("[EXTENSION'S QUOTE READY] Successfully pulled quote data from narze's repository")
		})
		.catch(err => console.log(err))

	let disposable = vscode.commands.registerCommand('salim-quote-delivery.getSalimQuote', () => {
		let randIndex: number = Math.floor(Math.random() * QuoteArray.length)

		vscode.window.showInformationMessage(`${QuoteArray[randIndex]}`);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
