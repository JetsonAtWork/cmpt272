import {MD5} from 'crypto-js'
import encBase64 from 'crypto-js/enc-base64';
/** 
 * @Kyaahn
 * This converts a file to Base64 (a string).
 * This is useful for storing a file in localstorage.
 * Ex. 
 * 1. User uploads file
 * 2. User submits form
 * 3. As a part of form submission, use a ref to the file input to retrieve the uploaded file
 * 4. Use this function to turn the image into a string
 * 5. Save report to localstorage
 * 6. When somebody retrieves this report from localstorage, they can plug the base64 
 * string into an img tag's src
 * 
 * NOTE: if you are saving an image to localstorage, you might want to find a way to compress it 
 * first since localstorage entries have a max size of like 5-10 MB. 
 * Check out these file compression packages and let me know if you need help
 * 
 * https://www.npmjs.com/package/browser-image-compression
 * https://www.npmjs.com/package/sharp (this one is really good but quite a large package)
 * */ 
function fileToBase64(file: Blob): Promise<string>{
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
          if (event.target)
              resolve(event.target.result as string);
          else throw new Error('Failed to read file')
      };
      reader.readAsDataURL(file);
    });
}
// Hashes a string using the specified hashing algorithm
function hashPassword(password: string) {
    const ret = encBase64.stringify(MD5(password))
    return ret
}
  
  export {
    fileToBase64,
    hashPassword
  }