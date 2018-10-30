function loadWebAssembly(filename, imports) {
  return fetch(filename)
    .then(response => response.arrayBuffer())
    .then(buffer => WebAssembly.compile(buffer))
    .then(module => {
      imports = imports || {};
      imports.env = imports.env || {};
      imports.env.memoryBase = imports.env.memoryBase || 0;
      imports.env.tableBase = imports.env.tableBase || 0;
      if (!imports.env.memory) {
        imports.env.memory = new WebAssembly.Memory({ initial: 256 });
      }
      if (!imports.env.table) {
        imports.env.table = new WebAssembly.Table({ initial: 0, 
          element: 'anyfunc' });
      }
      return new WebAssembly.Instance(module, imports);
    });
}

// Main part of this example, loads the module and uses it.
var loadedWasm = loadWebAssembly('matrix.wasm');
loadedWasm.then(instance => {
  console.log(instance.exports);
  var arrayDataToPass = [1,2,3,4,5,6];
  const typedArray = new Uint8Array(arrayDataToPass);

  // Allocate some space in the heap for the data (making sure to use the appropriate memory size of the elements)
  buffer = instance.Module._malloc(typedArray.length * typedArray.BYTES_PER_ELEMENT)

  // Assign the data to the heap - Keep in mind bytes per element
  Module.HEAPF32.set(typedArray, buffer >> 2)

  // Finally, call the function with "number" parameter type for the array (the pointer), and an extra length parameter
  result = Module.ccall("addNums", null, ["number", "number"], [buffer, arrayDataToPass.length])
}
);
