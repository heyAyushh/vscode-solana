/* eslint-disable @typescript-eslint/naming-convention */
import { readdirSync } from 'fs';
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Endpoint, EXPLORER_URL, SOLSCAN_URL } from "../constants";
import { TextDecoder } from "util";

export const getDirectories = (source: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

export const getFiles = (source: string, regex: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => !dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => name.match(regex));
export class PgCommon {
  static readonly TRANSITION_SLEEP = 200;

  /**
   * @param ms amount of time to sleep in ms
   * @returns a promise that will resolve after specified ms
   */
  static async sleep(ms: number = this.TRANSITION_SLEEP) {
    return new Promise((res) => setTimeout((s) => res(s), ms));
  }

  /**
   * @returns the decoded string
   */
  static decodeArrayBuffer(arrayBuffer: ArrayBuffer, type: string = "utf-8") {
    const decoder = new TextDecoder(type);
    const decodedString = decoder.decode(arrayBuffer);

    return decodedString;
  }

  /**
   * Check whether the http response is OK.
   * If there is an error, decode the array buffer and return it.
   *
   * @returns response array buffer if the response is OK
   */
  // @ts-expect-error Responses
  static async checkForRespErr(resp: Response) {
    const arrayBuffer = await resp.arrayBuffer();

    if (!resp.ok) {return { err: this.decodeArrayBuffer(arrayBuffer) };}

    return { arrayBuffer };
  }

  /**
   * @returns first and last (default: 5) chars of a public key and '...' in between as string
   */
  static shortenPk(pk: PublicKey | string, chars: number = 5) {
    const pkStr = typeof pk === "object" ? pk.toBase58() : pk;
    return `${pkStr.slice(0, chars)}...${pkStr.slice(-chars)}`;
  }

  /**
   * @returns lamports amount to equivalent Sol
   */
  static lamportsToSol(lamports: number) {
    return lamports / LAMPORTS_PER_SOL;
  }

  /**
   * @returns Sol amount to equivalent lamports
   */
  static solToLamports(sol: number) {
    return sol * LAMPORTS_PER_SOL;
  }

  /**
   * Convert seconds into human readable string format
   */
  static secondsToTime(secs: number) {
    const d = Math.floor(secs / (60 * 60 * 24)),
      h = Math.floor((secs % (60 * 60 * 24)) / (60 * 60)),
      m = Math.floor((secs % (60 * 60)) / 60),
      s = Math.floor(secs % 60);

    if (d) {return `${d}d`;}
    if (h) {return `${h}h`;}
    if (m) {return `${m}m`;}
    if (s) {return `${s}s`;}

    return "";
  }

  /**
   * @returns utf-8 encoded string from the arg
   */
  static getUtf8EncodedString(object: object) {
    return (
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(object))
    );
  }

  /**
   * Only used for adding cluster param to explorer url(s)
   */
  static getExplorerCluster(endpoint: string) {
    // Mainnet by default
    let cluster = "";

    if (endpoint === Endpoint.LOCALHOST) {
      cluster = "?cluster=custom&customUrl=" + Endpoint.LOCALHOST;
    } else if (
      endpoint === Endpoint.DEVNET ||
      endpoint === Endpoint.DEVNET_GENESYSGO
    )
      {cluster = "?cluster=devnet";}
    else if (endpoint === Endpoint.TESTNET) {cluster = "?cluster=testnet";}

    return cluster;
  }

  /**
   *  Used for getting transaction urls for explorers
   *
   * @returns tx url of [Solana Explorer, Solscan]
   */
  static getExplorerTxUrls(txHash: string, endpoint: Endpoint) {
    let explorer = EXPLORER_URL + "/tx/" + txHash;
    let cluster = this.getExplorerCluster(endpoint);

    // Solscan doesn't have support for localhost
    if (endpoint === Endpoint.LOCALHOST) {
      return [explorer + cluster];
    }

    const solscan = SOLSCAN_URL + "/tx/" + txHash + cluster;
    explorer += cluster;

    return [explorer, solscan];
  }

  /**
   * Calculate basic rem operations for css
   */
  static calculateRem(
    remOne: string,
    remTwo: string,
    operation: "add" | "substract"
  ) {
    const intOne = +remOne.split("rem")[0];
    const intTwo = +remTwo.split("rem")[0];

    let result;

    if (operation === "add") {result = intOne + intTwo;}
    else if (operation === "substract") {result = intOne - intTwo;}

    return result + "rem";
  }

  /**
   * @returns camelCase converted version of the string input
   */
  static toCamelCase(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
      if (+match === 0) {return "";} // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  /**
   * @returns automatic airdrop amount
   */
  static getAirdropAmount(endpoint: Endpoint) {
    switch (endpoint) {
      case Endpoint.LOCALHOST:
        return 100;
      case Endpoint.DEVNET:
        return 2;
      case Endpoint.TESTNET:
        return 1;
      default:
        return null;
    }
  }


  /**
   * Get send and receive event names
   *
   * @param eventName name of the custom event
   * @returns names of the send and receive
   */
  static getSendAndReceiveEventNames(eventName: string) {
    const send = eventName + "send";
    const receive = eventName + "receive";
    return { send, receive };
  }

  /**
   * Get static get and run event names
   *
   * @param eventName name of the custom event
   * @returns names of the get and run
   */
  static getStaticEventNames(eventName: string) {
    const get = eventName + "get";
    const run = eventName + "run";
    return { get, run };
  }


  /**
   * Make a noun plural
   *
   * @param noun name of the noun
   * @param length item length that will decide whether to make the noun plural
   * @param plural plural version of the name for irregular suffixes
   * @returns plural version of the noun
   */
  static makePlural(noun: string, length: number, plural?: string) {
    if (length > 1) {return plural ?? noun + "s";}
    return noun;
  }

  /**
   * Convert objects into pretty JSON strings
   *
   * @param obj json object
   * @returns prettified string output
   */
  static prettyJSON(obj: object) {
    return JSON.stringify(obj, null, 2);
  }

  /**
   * Adds space before the string, mainly used for terminal output
   *
   * @param str string to prepend spaces to
   * @param spaceAmount amount of space characters
   * @returns the space prepended string
   */
  static addSpace(str: string, spaceAmount: number) {
    return (
      new Array(spaceAmount).fill(null).reduce((acc) => acc + " ", "") + str
    );
  }
}

