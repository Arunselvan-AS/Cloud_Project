const express = require('express')
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const { stdout } = require('process');
const deasync = require('deasync');
const ns = require('./nsfunctions/nsFunctions');

app.set('view engine','ejs');
app.use(express.json());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/css",
  express.static(path.join(".", "node_modules/bootstrap/dist/css"))
)
app.use(
  "/js",
  express.static(path.join(".", "node_modules/bootstrap/dist/js"))
)
app.use("/js", express.static(path.join(".", "node_modules/jquery/dist")))
app.use("/js", express.static(path.join(".", "js/")))
app.use("/css", express.static(path.join(".", "css/")))
app.use("/js", express.static(path.join(".", "node_modules/codemirror/lib")))
app.use("/css",express.static(path.join(".","node_modules/codemirror/lib")))
app.use("/css",express.static(path.join(".","node_modules/codemirror/theme")))
app.use("/js",express.static(path.join(".","node_modules/codemirror/mode")))
app.use("/files",express.static(path.join(".","results")))
//Index
app.get('/',(req,res)=>{
    res.render('index');
});

app.post('/compile',(req,res)=>{
    var code = req.body.code;
    var ipaddr = req.body.ip;
    //Creating the user directory using the ip address of user
    var mkfile = ns.makedir(ipaddr);
    //Writing the code to the tcl file 
    var wrtFile = ns.writeFile(ipaddr,code);
    //Compiling the Code
    var result = ns.compileCode(ipaddr);
    console.log(result);
    if(result.error||result.stderr)
    {
      res.json({status:"Compilation Failed",outputStatus:`${result.stdout}${result.stderr}`});
    }
    else
    {
      res.json({status:"Compilation Successful",outputStatus:`${result.stdout}${result.stderr}`});
    }
});
app.post('/getPDR',(req,res)=>{
  var ipaddr = req.body.ipaddr;
  var sentPDR = ns.sentPdr(ipaddr);
  var recPDR = ns.recPdr(ipaddr);
  var colPDR = ns.colPdr(ipaddr);
  res.json({sent:sentPDR.stdout,receive:recPDR.stdout,collided:colPDR.stdout});
})
app.post('/deleteUser',(req,res)=>{
  var del = ns.deleteCode(req.body.ipaddr); 
});
const port = 5000;
app.listen(port,()=> console.log(`Server started on port ${port}`));