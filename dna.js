import DNA_NAME from 'index';
import dna from `../hc-dna/workdir/${DNA_NAME}.dna`;

export const DNA = Buffer.from(dna, 'base64');
