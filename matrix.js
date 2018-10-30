function loadWebAssembly(filename, imports) {
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
  return [fetch(filename)
    .then(response => response.arrayBuffer())
    .then(buffer => WebAssembly.compile(buffer))
    .then(module => {
      return new WebAssembly.Instance(module, imports);
    }), imports];
}

var [wasmInstance, imports] = loadWebAssembly("./matrix.wasm");
wasmInstance.then(instance => {
  var offset = instance.exports.__Z9getBufferv();
  // create a view on the memory that points to this array
  var linearMemory = new Uint32Array(imports.env.memory.buffer, offset, 100);
  // populate with some data
  for (var i = 0; i < linearMemory.length; i++) {
    linearMemory[i] = i;
  }
  // mutate the array within the WebAssembly module
  instance.exports.__Z6matrixv();
  console.log(linearMemory);
})
