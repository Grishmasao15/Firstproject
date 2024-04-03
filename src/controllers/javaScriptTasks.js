


module.exports=
function javaScriptTask(req, res){
    
  let result = req.params.result;

  res.render("../src/views/" + result);
};
