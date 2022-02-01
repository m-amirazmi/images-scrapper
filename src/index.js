const fetch = require("isomorphic-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
const imageDownload = require("image-download");
const imageType = require("image-type");

// SPECIFY THE CAT & SUBCAT
const category = "furniture";
const subcategory = "table";

const fetchWebpages = async () => {
	// FETCH THE IMAGE LIST FROM THE SUBCAT PAGE
	const response = await fetch(`http://pngimg.com/images/${category}/${subcategory}`);
	const text = await response.text();
	const dom = await new JSDOM(text);
	const downloadPng = dom.window.document.querySelectorAll(".download_png");
	const downloadPngLinks = [];

	// GET THE IMAGE DOWNLOAD URL
	downloadPng.forEach((png) => {
		const pngId = png.getAttribute("href").split("/")[2];
		const downloadUrl = `https://pngimg.com/uploads/${subcategory}/${subcategory}_PNG${pngId}.png`;
		downloadPngLinks.push(downloadUrl);
	});

	console.log("TOTAL DOWNLOAD LINKS =>", downloadPngLinks.length);

	// DOWNLOAD THE IMAGE AND STORE IN DIRECTORY
	downloadPngLinks.forEach((url, key) => {
		const getName = url.split("/")[5].split(".")[0];

		imageDownload(url).then((buffer) => {
			const type = imageType(buffer);
			fs.writeFile(`./downloads/${subcategory}/${getName}.${type.ext}`, buffer, (err) => err && console.log(err, url));

			const dir = `./downloads/${subcategory}`;
			fs.readdir(dir, (err, files) => {
				console.log("TOTAL FILES IN DIR =>", files.length);
			});
		});
	});
};

fetchWebpages();
