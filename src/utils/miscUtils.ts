import {MD5} from 'crypto-js'
import encBase64 from 'crypto-js/enc-base64';
import {Incident} from "@/types";
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
function fileToBase64(file: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
          if (event.target)
              resolve(event.target.result);
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

function seedCurrentIncidents(): Incident[] {
    const date1 = new Date();
    date1.setMonth(2);

    const date2 = new Date();
    date2.setMonth(5);

    return [{
        id: 1,
        date: new Date(),
        status: "open",
        emergencyDesc: "Fire",
        pictureLink: "https://i1.wp.com/media.globalnews.ca/videostatic/news/lvzdc2dlst-gpfh895vc6/WEB_FIRE.jpg?w=1200&quality=70&strip=all",
        comments: "Here is a comment",
        location: {
            name: "Metrotown",
            address: "4700 Kingsway, Burnaby, BC V5H 4M5"
        }
    },
    {
        id: 2,
        date: date1,
        status: "open",
        emergencyDesc: "Missing Person",
        pictureLink: "",
        comments: "Here is a comment",
        location: {
            name: "SFU Surrey",
            address: "13450 102 Ave #250, Surrey, BC V3T 0A3"
        }
    },
    {
        id: 3,
        date: date2,
        status: "resolved",
        emergencyDesc: "Car Accident",
        pictureLink: "",
        comments: "Here is a comment",
        location: {
            name: "1660 E Broadway",
            address: "1660 E Broadway, Vancouver, BC V5N 1W1"
        }
    }]
}
  
  export {
    fileToBase64,
    hashPassword,
    seedCurrentIncidents
  }