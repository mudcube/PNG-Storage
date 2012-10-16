This is a demo of using PNG to compress and decompress data to be used in Javascript. This demo is heavily inspired by Nihilogic, and is really just an update that includes javascript decompress, along with tweaking the compression to use all three RGB values instead of just luminance.

The library is easy to use, there are two functions;

PNGStorage.encode(data);

PNGStorage.decode(data, callback);