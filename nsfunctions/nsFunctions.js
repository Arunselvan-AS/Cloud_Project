const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const { stdout } = require('process');
const deasync = require('deasync');

function makedir(ipaddr)
{
    var ret;
    fs.mkdir(`./results/${ipaddr}`,function(err){
        if(err)
        {
          console.log(err);
        }else 
        {
          console.log("Folder created");
        }
        ret={err:err,status:'Folder Created'};
    });
    while((ret == null))
    {
        deasync.runLoopOnce();
    }
    return (ret);
}
function writeFile(ipaddr,code)
{
    var ret;
    fs.writeFile(`./results/${ipaddr}/code.tcl`,code,function(err){
        if(err) 
        {
            console.log(err);
        }
        console.log("File created");
        ret={err:err,status:'File Created'};
    });
    while((ret == null))
    {
        deasync.runLoopOnce();
    }
    return (ret);
}
function compileCode(ipaddr)
{
  var ret;
  exec(`cd results/${ipaddr}/ && ns code.tcl`,(error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    ret = {error:error,stdout:stdout,stderr:stderr};
  });
  while((ret == null))
  {
    deasync.runLoopOnce();
  }
  return (ret);
}
function deleteCode(ipaddr)
{
  var ret;
  exec(`cd results && rm -rf ${ipaddr}`,(error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    ret = {error:error,stdout:stdout,stderr:stderr};
  });
  while((ret == null))
  {
    deasync.runLoopOnce();
  }
  return (ret);
}
function sentPdr(ipaddr)
{
  var ret;
  exec(`cd results/${ipaddr}/ && grep "^+" *.tr | wc -l`,(error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    ret = {error:error,stdout:stdout,stderr:stderr};
  });
  while((ret == null))
  {
    deasync.runLoopOnce();
  }
  return (ret);
}
function recPdr(ipaddr)
{
  var ret;
  exec(`cd results/${ipaddr}/ && grep "^r" *.tr | wc -l`,(error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    ret = {error:error,stdout:stdout,stderr:stderr};
  });
  while((ret == null))
  {
    deasync.runLoopOnce();
  }
  return (ret);
}
function colPdr(ipaddr)
{
  var ret;
  exec(`cd results/${ipaddr}/ && grep "^c" *.tr | wc -l`,(error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    ret = {error:error,stdout:stdout,stderr:stderr};
  });
  while((ret == null))
  {
    deasync.runLoopOnce();
  }
  return (ret);
}

module.exports = {
    compileCode,
    sentPdr,
    recPdr,
    colPdr,
    makedir,
    writeFile,
    deleteCode
};