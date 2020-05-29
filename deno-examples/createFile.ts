const encoder = new TextEncoder();

const greetText = encoder.encode("Hello World\n My Name is Mahendra AR");

await Deno.writeFile("greet.txt", greetText);

// deno run --allow-write createFile.ts
