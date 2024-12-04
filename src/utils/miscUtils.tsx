import {MD5} from 'crypto-js'
import encBase64 from 'crypto-js/enc-base64';
import {Incident} from "@/types";
import { useEffect } from 'react';
import { DivIcon, divIcon, Icon, LatLng } from 'leaflet';
import { renderToString } from 'react-dom/server';
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

function seedCurrentIncidents(): Incident[] {
    return [{
        id: '1',
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
        id: '2',
        date: new Date(),
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
        id: '3',
        date: new Date(),
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

function condStr(condition: boolean, str: string) {
    return condition ? str : ''
}

function validatePhoneNumber(num: string) {
    const validLengths = [10,11]
    return validLengths.includes(num.length)
}

function curry(fn, ...params: any[]) {
    const curried = (...other) => {
        if (fn.length !== other.length) {
            return curried.bind(null, ...other);
        }
        return fn(...other);
    };
    return curried(...params);
};

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true
});
function rangeArray(start, end) {
    if (start > end) return [];
    if (Number.isNaN(start) || Number.isNaN(end)) return [];
    return Array(end - start + 1)
        .fill()
        .map((_, idx) => start + idx);
}
function latLngsEqual(a: LatLng ,b: LatLng) {
    if (!a || !b) return false
    return a.lat === b.lng && a.lng === b.lng
}
function getMapIcon(svgClassName: string) {
    return new DivIcon({
        html: renderToString(
            <div className='relative'>
                <svg className={`w-10 h-10  ${svgClassName} !z-[1000]`} width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fillRule="evenodd" d="M256 42.667c82.475 0 149.334 66.859 149.334 149.333c0 27.204-7.254 52.694-19.983 74.676Q372.62 288.657 256 490.667q-116.622-202.01-129.35-223.991c-12.73-21.982-19.984-47.472-19.984-74.676c0-82.474 66.859-149.333 149.333-149.333M256 128c-35.346 0-64 28.654-64 64s28.654 64 64 64s64-28.653 64-64c0-35.346-28.653-64-64-64"/></svg>
                <img width={60} height={60} className='absolute bottom-0 left-2 -z-[10]' src='shadow.png'/>
            </div>
    ),
        iconSize : [40, 40],
        iconAnchor : [20, 40],
        popupAnchor : [0, -35],
        // shadowSize: [40,40],
        // shadowAnchor: [4,40],
        // shadowUrl: 'shadow-marker.png',
        // shadowRetinaUrl: 'shadow-marker.png',
        className: ''
        
    })
}

  export {
    fileToBase64,
    hashPassword,
    seedCurrentIncidents,
    condStr,
    validatePhoneNumber,
    curry,
    DATE_FORMAT,
    rangeArray,
    latLngsEqual,
    getMapIcon,
  }