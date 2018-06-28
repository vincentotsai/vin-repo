let root = {
  id: 11,
  children: [
    {
      id: 21
    },
    {
      id: 22,
      children: [
        {
          id: 31
        },
        {
          id: 32,
          children: [
            {
              id: 41
            }
          ]
        }
      ]
    }
  ]
}
let nodesIds = []
function nodeHandler(root) {
  if(!root) {
    throw new Error('root empty!')
  }
  nodesIds.push(root.id)
  if(root.children && root.children.length) {
    for (let i = 0; i < root.children.length; i++) {
      const node = root.children[i];
      nodeHandler(node)
    }
  }
}
nodeHandler(root)
console.log('nodesIds>>',nodesIds)