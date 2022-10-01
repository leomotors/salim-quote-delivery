import * as vscode from 'vscode';
import fetch from 'node-fetch';

const SALIM_API_URL = 'https://watasalim.vercel.app/api/quotes';

const ALL_SALIM_QUOTE_API_URL =
  'https://github.com/narze/awesome-salim-quotes/blob/main/README.md';

const LINK_TO_HEAVEN = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

const RICK_ROLL_CHANCE = 5;

const quotesArray: string[] = [];

export async function activate(context: vscode.ExtensionContext) {
  // * Fetching Quotes from API
  try {
    const response = await fetch(SALIM_API_URL, {
      method: 'GET',
      headers: { 'Content-type': 'application/json;charset=UTF-8' },
    });

    const json = await response.json();

    for (const quote of json.quotes) {
      quotesArray.push(quote.body);
    }

    console.log(
      "[EXTENSION'S QUOTE READY] Successfully pulled quote data from narze's repository"
    );
  } catch (error) {
    console.error(error);
  }

  const delivery: vscode.Disposable = vscode.commands.registerCommand(
    'salim-quote-delivery.getSalimQuote',
    () => {
      // * Check for Errors
      if (quotesArray.length === 0) {
        vscode.window.showErrorMessage(
          'ERROR: Quote Array is empty. There maybe issues initializing or API is down.'
        );
        return;
      }

      // * Random Quote Index
      const randIndex = Math.floor(
        Math.random() * quotesArray.length
      );

      // * Show it
      vscode.window.showInformationMessage(
        `${quotesArray[randIndex]} (#${randIndex + 1})`
      );

      // * You have a Chance to be sent to Heaven
      if (Math.floor(Math.random() * 100) < RICK_ROLL_CHANCE) {
        vscode.env.openExternal(vscode.Uri.parse(LINK_TO_HEAVEN));
      }
    }
  );

  const showAllQuotes: vscode.Disposable =
    vscode.commands.registerCommand(
      'salim-quote-delivery.showAllQuotes',
      () => {
        vscode.env.openExternal(
          vscode.Uri.parse(ALL_SALIM_QUOTE_API_URL)
        );
      }
    );

  context.subscriptions.push(delivery);
  context.subscriptions.push(showAllQuotes);
}

export function deactivate() {}
