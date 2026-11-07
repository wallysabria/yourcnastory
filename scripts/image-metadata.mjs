// Signature and dimensions only; no image rewriting or external dependency.
export function imageMetadata(b){
 if(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return{format:'png',extension:'.png',width:b.readUInt32BE(16),height:b.readUInt32BE(20)};
 if(b[0]===255&&b[1]===216){let i=2;while(i<b.length){if(b[i]!==255){i++;continue;}while(b[i]===255)i++;const marker=b[i++];if(marker===217||marker===218)break;if(marker===1||(marker>=208&&marker<=215))continue;const length=b.readUInt16BE(i);if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker))return{format:'jpeg',extension:'.jpg',width:b.readUInt16BE(i+5),height:b.readUInt16BE(i+3)};if(length<2)throw Error('Invalid JPEG segment');i+=length;}}
 throw Error('Unsupported or invalid screenshot image signature');
}
