import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

const main = async () => {
  const argv = await yargs(hideBin(process.argv))
    .usage("Usage: $0 <command> [options]")
    .command("serve", "Starts cryptobase and serves API endpoints").argv;

  const [command] = argv._;

  switch (command) {
    case "serve":
      console.log("In serve");
      break;
    default:
      throw Error("No command given");
  }
};

main().catch((err: Error) => console.log(err));
