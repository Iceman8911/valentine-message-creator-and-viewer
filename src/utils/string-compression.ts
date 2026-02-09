const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function compressStringToBase64(str: string): Promise<string> {
	const strStream = new Blob([str]).stream();

	const compressedStream = strStream.pipeThrough(
		new CompressionStream("deflate-raw"),
	);

	const compressedBytes = await new Response(compressedStream).bytes();

	const compressedBinaryString = String.fromCharCode(...compressedBytes);

	return btoa(compressedBinaryString);
}

export async function decompressBase64ToString(
	base64: string,
): Promise<string> {
	const compressedBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

	const compressedStream = new Blob([compressedBytes]).stream();

	const decompressedStream = compressedStream.pipeThrough(
		new DecompressionStream("deflate-raw"),
	);

	const decompressedBytes = await new Response(
		decompressedStream,
	).arrayBuffer();

	return decoder.decode(decompressedBytes);
}
