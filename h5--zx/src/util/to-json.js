export default function(str) {
  if (typeof str == 'string') {
    let result = [{
      type: 0,
      content: str
    }]
    try {
      let temp = JSON.parse(str)
      if(temp && typeof(temp) === 'object' && temp.length > 0) {
        return temp
      } else {
        return result
      }
    } catch(e) {
      console.log(e)
      return result
    }
  }
}
