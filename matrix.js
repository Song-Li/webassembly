function loadWebAssembly(filename, imports) {
  imports = imports || {};
  imports.env = imports.env || {};
  imports.env.memoryBase = imports.env.memoryBase || 0;
  imports.env.tableBase = imports.env.tableBase || 0;
  if (!imports.env.memory) {
    // the number of pages, 64K per page
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
  console.log(instance.exports);
  var offset = instance.exports.__Z9getBufferv();
  var offset2 = instance.exports.__Z11getOpMatrixv();
  var linearMemory = new Uint32Array(imports.env.memory.buffer, offset, 100);
  var linearMemory2 = new Uint32Array(imports.env.memory.buffer, offset2, 100);
  for (var i = 0; i < linearMemory.length; i++) {
    linearMemory2[i] = i;
  }
  instance.exports.__Z6matrixv();
  console.log(linearMemory2);
})
