import axios, { AxiosError } from 'axios';
import { BannerMessageType } from '../components/BannerMessage';
import { Modals } from './modalCurator';


export type ErrorShard = {
  code: string;
}

const UnknownErrorShard: ErrorShard = { code: '' };

function extractErrorShard(data: any) {
  if (data === undefined || data['code'] === undefined) {
    return UnknownErrorShard;
  }

  let shard: ErrorShard = {
    code: data['code']
  };

  return shard;
}

export function handleCuratorError(error: Error | ErrorShard, displayMessage: boolean = true, defaultMessage?: string): ErrorShard {
  let shard: ErrorShard;
  let message: string;

  if (error instanceof Error) {
    shard = UnknownErrorShard;
    console.error('Unexpected error___________\n' + error);
    message = defaultMessage ?? generateUnknownErrorMessage();
  } else {
    shard = error;
    message = `errors:${shard.code}`, { defaultValue: defaultMessage ?? generateUnknownErrorMessage() }
  }

  if (displayMessage) {
    Modals.toastMiniMessage(message, BannerMessageType.Error);
  }

  return shard;
}

export function handleRequestError(error: Error | AxiosError, context?: string): never {

  const caller = context ?? 'unknown';

  let errorShard;

  try {
    let accError: string = '';

    if (axios.isAxiosError(error)) {
      accError += `Outgoing api call error at ${caller}.\n`;
      accError += `code: ${error.code ?? 'none'}\n`;
      accError += `cause: ${error.cause ?? 'unknown'}\n`;
      accError += `message: ${error.message ?? 'none'}\n`;

      if (error.response) {
        accError += `response:\n` +
          `${JSON.stringify(error.response.data, null, 2)}\n` +
          `${error.response.status}\n` +
          `${JSON.stringify(error.response.headers, null, 2)}\n`;
        
        errorShard = extractErrorShard(error.response.data);
      } else if (error.request) {
        accError += `request:\n` +
          `${JSON.stringify(error.request, null, 2)}\n`;
      } else {
        accError += `Axios call failed\n${error.code}\n${error.message}\n`;
      }
    }
    else {
      accError += `Local api call error at ${caller}.\n${error}\n`;
    }

    console.error(accError);
  } catch {
    console.error(`Failed to handle request error in ${caller}, likely undefined.\n${error}`);
  }

  if (errorShard) {
    throw errorShard;
  } else {
    throw UnknownErrorShard;
  }
}

export function handleSocketError(error: Error, context?: string): never {

  const caller = context ?? 'unknown';

  let errorShard;

  try {
    errorShard = extractErrorShard(error.message);
  } catch {
    console.error(`Failed to handle request error in ${caller}, likely undefined.\n${error}`);
  }

  if (errorShard) {
    throw errorShard;
  } else {
    throw UnknownErrorShard;
  }
}

function generateUnknownErrorMessage() {
  const possibleMessages = [
    'Yikes, that did not work, try again.',
    'The server hit a wall, give it another go.',
    'A sneaky network mouse ate your request... try again.',
    'Request failed. Sorry!',
    'An issue, perhaps... try again.',
    'Unknown, unexpected, and likely undefined failure, apologies.',
    'Your request encountered an evil wizard that turned it into a toad. Please try again.',
    'Goblin got your toe! Please try that request again.'
  ];

  return possibleMessages[Math.floor(Math.random() * possibleMessages.length)];
}