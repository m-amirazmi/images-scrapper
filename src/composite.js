const jimp = require("jimp");
const fs = require("fs");

const subcategory = "cupboard_closet";
const background = "./background.png";

const readFiles = async () => {
	const urls = await fs.promises.readdir(`./downloads/${subcategory}`);
	return urls.map((url) => `./downloads/${subcategory}/${url}`);
};

const main = async () => {
	const images = await readFiles();
	Promise.all(
		images.map(async (i, key) => {
			const jimpProduct = await jimp.read(i);
			const jimpread = await jimp.read(background).then((b) => {
				const heightBackground = b.getHeight();
				const heightProductImage = jimpProduct.getHeight();
				const widthBackground = b.getWidth();
				const widthProductImage = jimpProduct.getWidth();
				const y = (heightBackground - heightProductImage) / 2;
				const x = (widthBackground - widthProductImage) / 2;
				return b.composite(jimpProduct, x, y);
			});
			jimpread.write(`./downloads-new/${subcategory}/${subcategory}_${key}.png`);
		})
	);
};

main();
