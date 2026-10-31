const fs = require('node:fs/promises'), sharp = require('sharp');
(async () => {
 const svg=await fs.readFile('app/icon.svg'),sizes=[16,32,48,64],images=[];
 for(const size of sizes) images.push(await sharp(svg).resize(size,size).png().toBuffer());
 const header=Buffer.alloc(6+sizes.length*16);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);
 let offset=header.length;
 images.forEach((png,i)=>{const n=6+i*16;header[n]=sizes[i];header[n+1]=sizes[i];header.writeUInt16LE(1,n+4);header.writeUInt16LE(32,n+6);header.writeUInt32LE(png.length,n+8);header.writeUInt32LE(offset,n+12);offset+=png.length;});
 await fs.writeFile('app/favicon.ico',Buffer.concat([header,...images]));
 await sharp(svg).resize(180,180).png().toFile('app/apple-icon.png');
 console.log('BINDY SVG, multi-size favicon and Apple touch icon prepared.');
})();
