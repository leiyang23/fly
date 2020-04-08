const trans = {
  "sunyanzi":"孙燕姿",
  "zhoujielun":"周杰伦",
  "liudehua":"刘德华",
  "xuwei":"许巍"
}
const debug = false;

let basePath = "https://assert.freaks.group/api"
if (debug){
  basePath = "http://127.0.0.1/api"
}


module.exports.basePath = basePath
module.exports.trans = trans