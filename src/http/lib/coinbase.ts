import { Coinbase } from "@coinbase/coinbase-sdk";
// import * as path from 'path'

// // Helper function to get __dirname equivalent in ESM
// const getDirname = (importMetaUrl: string): string => {
//   // This will return the directory of the current module file
//   return path.dirname(new URL(importMetaUrl).pathname);
// };

export const coinbase = () => {
  try {
    // const __dirname = getDirname(import.meta.url);

    // // Resolve the absolute path to the API key file in the root of the project
    // const apiKeyFilePath = path.resolve(__dirname, '../../../../cdp_api_key.json'); // Go up 5 levels to the root
  
    // console.log('Resolved apiKeyFilePath:', apiKeyFilePath); // Debugging to verify the path
  
    // Change this to the path of your API key file downloaded from CDP portal.
    Coinbase.configureFromJson({ filePath: "./cdp_api_key.json" });

    return Coinbase;
    
  } catch (error: unknown) {

    console.error(error)

    if (error instanceof Error) {
      return { error: error.message }
    }
  }
}
