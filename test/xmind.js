var tree = {
  value: 1,
  left: {
    value: 2,
    left: {
      value: 4
    }
  },
  right: {
    value: 3,
    left: {
      value: 5,
      left: {
        value: 7
      },
      right: {
        value: 8
      }
    },
    right: {
      value: 6
    }
  }
}




var que = []
var levelOrderTraversal = function (node) {
  if (!node) {
    throw new Error('Empty Tree')
  }

  que.push(node)
  while (que.length !== 0) {
    node = que.shift()
    
    if (node.left) que.push(node.left)
    if (node.right) que.push(node.right)
  }
}

levelOrderTraversal(tree)
console.log(que)